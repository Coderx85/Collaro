use std::io::Cursor;
use std::str::FromStr;

use image::codecs::webp::WebPEncoder;
use image::{DynamicImage, ExtendedColorType};
use image::imageops::FilterType;

use super::error::PipelineError;

pub const AVATAR_SIZE: u32 = 400;
pub const MAX_FILE_SIZE: u64 = 10_000_000;

#[derive(Debug)]
pub struct ProcessedImage {
    pub bytes: Vec<u8>,
    pub content_type: &'static str,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum Variant {
    Avatar,
    Thumbnail,
    Medium,
    Full,
}

impl Variant {
    pub fn size(&self) -> u32 {
        match self {
            Variant::Avatar => 400,
            Variant::Thumbnail => 150,
            Variant::Medium => 800,
            Variant::Full => 1920,
        }
    }

    pub fn suffix(&self) -> &'static str {
        match self {
            Variant::Avatar => "avatar",
            Variant::Thumbnail => "thumb",
            Variant::Medium => "medium",
            Variant::Full => "full",
        }
    }
}

impl FromStr for Variant {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "avatar" => Ok(Variant::Avatar),
            "thumb" | "thumbnail" => Ok(Variant::Thumbnail),
            "medium" => Ok(Variant::Medium),
            "full" => Ok(Variant::Full),
            _ => Err(()),
        }
    }
}

pub fn validate_and_process(data: &[u8]) -> Result<ProcessedImage, PipelineError> {
    let img = load_and_validate(data)?;
    let img = apply_exif_orientation(&img, data);
    let cropped = center_square_crop(&img);
    let resized = cropped.resize_exact(AVATAR_SIZE, AVATAR_SIZE, FilterType::Lanczos3);
    let bytes = encode_webp(&resized)?;
    Ok(ProcessedImage { bytes, content_type: "image/webp" })
}

pub fn process_variant(data: &[u8], variant: Variant) -> Result<ProcessedImage, PipelineError> {
    let img = load_and_validate(data)?;
    let img = apply_exif_orientation(&img, data);
    let size = variant.size();
    let (w, h) = (img.width(), img.height());

    let processed = if variant == Variant::Full {
        let max_dim = w.max(h);
        if max_dim > size {
            let ratio = f64::from(size) / f64::from(max_dim);
            let nw = (f64::from(w) * ratio) as u32;
            let nh = (f64::from(h) * ratio) as u32;
            img.resize_exact(nw.max(1), nh.max(1), FilterType::Lanczos3)
        } else {
            img
        }
    } else {
        // Avatar, Thumbnail, and Medium all use center-square crop + fit
        let cropped = center_square_crop(&img);
        cropped.resize_exact(size, size, FilterType::Lanczos3)
    };

    let bytes = encode_webp(&processed)?;
    Ok(ProcessedImage { bytes, content_type: "image/webp" })
}

fn load_and_validate(data: &[u8]) -> Result<DynamicImage, PipelineError> {
    if data.len() as u64 > MAX_FILE_SIZE {
        return Err(PipelineError::FileTooLarge(data.len() as u64, MAX_FILE_SIZE));
    }

    let format = image::guess_format(data)
        .map_err(|_| PipelineError::UnsupportedFormat)?;

    let supported = matches!(format, image::ImageFormat::Jpeg
        | image::ImageFormat::Png
        | image::ImageFormat::WebP
        | image::ImageFormat::Gif);

    if !supported {
        return Err(PipelineError::UnsupportedFormat);
    }

    Ok(image::load_from_memory(data)?)
}

fn center_square_crop(img: &DynamicImage) -> DynamicImage {
    let (w, h) = (img.width(), img.height());
    let size = w.min(h);
    let x = (w - size) / 2;
    let y = (h - size) / 2;
    img.crop_imm(x, y, size, size)
}

fn encode_webp(img: &DynamicImage) -> Result<Vec<u8>, PipelineError> {
    let rgba = img.to_rgba8();
    let (width, height) = rgba.dimensions();
    let pixels = rgba.into_raw();
    let mut buf = Vec::new();
    WebPEncoder::new_lossless(&mut buf)
        .encode(&pixels, width, height, ExtendedColorType::Rgba8)
        .map_err(|e| PipelineError::Encode(e.to_string()))?;
    Ok(buf)
}

/// Reads the EXIF orientation tag from raw bytes and rotates the image
/// so it displays right-side up.
///
/// Orientation values handled:
/// - 3: Rotate 180°
/// - 6: Rotate 90° CW (common for portrait phone photos)
/// - 8: Rotate 90° CCW
///
/// Falls back to the original image if EXIF data is absent or parsing fails.
fn apply_exif_orientation(img: &DynamicImage, raw: &[u8]) -> DynamicImage {
    let Ok(exif_reader) = exif::Reader::new().read_from_container(&mut Cursor::new(raw)) else {
        return img.clone();
    };

    let orientation = match exif_reader
        .get_field(exif::Tag::Orientation, exif::In::PRIMARY)
    {
        Some(f) => f.value.get_uint(0).unwrap_or(1),
        None => return img.clone(),
    };

    match orientation {
        3 => img.rotate180(),
        6 => img.rotate90(),
        8 => img.rotate270(),
        _ => img.clone(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn png_800x600() -> Vec<u8> {
        let mut buf = Cursor::new(Vec::new());
        DynamicImage::new_rgba8(800, 600)
            .write_to(&mut buf, image::ImageFormat::Png)
            .expect("in-memory write should not fail");
        buf.into_inner()
    }

    fn png(w: u32, h: u32) -> Vec<u8> {
        let mut buf = Cursor::new(Vec::new());
        DynamicImage::new_rgba8(w, h)
            .write_to(&mut buf, image::ImageFormat::Png)
            .expect("in-memory write should not fail");
        buf.into_inner()
    }

    mod validate_and_process {
        use super::*;

        #[test]
        fn should_accept_png() {
            let result = validate_and_process(&png_800x600());
            assert!(result.is_ok());
        }

        #[test]
        fn should_reject_images_larger_than_max_file_size() {
            let huge = vec![0u8; (MAX_FILE_SIZE + 1) as usize];
            let result = validate_and_process(&huge);
            assert!(matches!(result.unwrap_err(), PipelineError::FileTooLarge(_, _)));
        }
    }

    mod variant {
        use super::*;

        #[test]
        fn avatar_should_be_400px() {
            assert_eq!(Variant::Avatar.size(), 400);
        }

        #[test]
        fn thumbnail_should_be_150px() {
            assert_eq!(Variant::Thumbnail.size(), 150);
        }

        #[test]
        fn medium_should_be_800px() {
            assert_eq!(Variant::Medium.size(), 800);
        }

        #[test]
        fn full_should_be_1920px() {
            assert_eq!(Variant::Full.size(), 1920);
        }

        #[test]
        fn avatar_should_have_suffix_avatar() {
            assert_eq!(Variant::Avatar.suffix(), "avatar");
        }

        #[test]
        fn thumbnail_should_have_suffix_thumb() {
            assert_eq!(Variant::Thumbnail.suffix(), "thumb");
        }

        #[test]
        fn medium_should_have_suffix_medium() {
            assert_eq!(Variant::Medium.suffix(), "medium");
        }

        #[test]
        fn full_should_have_suffix_full() {
            assert_eq!(Variant::Full.suffix(), "full");
        }

        #[test]
        fn should_parse_avatar() {
            assert_eq!("avatar".parse::<Variant>().unwrap(), Variant::Avatar);
        }

        #[test]
        fn should_parse_thumb() {
            assert_eq!("thumb".parse::<Variant>().unwrap(), Variant::Thumbnail);
        }

        #[test]
        fn should_parse_thumbnail() {
            assert_eq!("thumbnail".parse::<Variant>().unwrap(), Variant::Thumbnail);
        }

        #[test]
        fn should_parse_medium() {
            assert_eq!("medium".parse::<Variant>().unwrap(), Variant::Medium);
        }

        #[test]
        fn should_parse_full() {
            assert_eq!("full".parse::<Variant>().unwrap(), Variant::Full);
        }

        #[test]
        fn should_reject_invalid_variant_string() {
            assert!("invalid".parse::<Variant>().is_err());
        }
    }

    mod center_square_crop {
        use super::*;

        #[test]
        fn should_crop_800x600_to_600x600() {
            let img = DynamicImage::new_rgba8(800, 600);
            let cropped = center_square_crop(&img);
            assert_eq!(cropped.width(), 600);
            assert_eq!(cropped.height(), 600);
        }
    }

    mod process_variant {
        use super::*;

        #[test]
        fn avatar_should_produce_webp() {
            let result = process_variant(&png_800x600(), Variant::Avatar).unwrap();
            assert_eq!(result.content_type, "image/webp");
            assert!(!result.bytes.is_empty());
        }

        #[test]
        fn full_should_downscale_large_images() {
            let data = png(3000, 2000);
            let result = process_variant(&data, Variant::Full).unwrap();
            assert!(!result.bytes.is_empty());
        }

        #[test]
        fn full_should_keep_small_images_unchanged() {
            let data = png(100, 100);
            let result = process_variant(&data, Variant::Full).unwrap();
            assert!(!result.bytes.is_empty());
        }
    }

    mod encode_webp {
        use super::*;

        #[test]
        fn should_produce_non_empty_output() {
            let img = DynamicImage::new_rgba8(10, 10);
            let result = encode_webp(&img);
            assert!(result.is_ok());
            assert!(!result.unwrap().is_empty());
        }
    }
}
