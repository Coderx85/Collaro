use image::codecs::webp::WebPEncoder;
use image::{DynamicImage, ExtendedColorType};
use image::imageops::FilterType;

use super::error::PipelineError;

pub const AVATAR_SIZE: u32 = 400;
pub const MAX_FILE_SIZE: u64 = 10_000_000;

pub struct ProcessedImage {
    pub bytes: Vec<u8>,
    pub content_type: &'static str,
}

pub fn validate_and_process(data: &[u8]) -> Result<ProcessedImage, PipelineError> {
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

    let img = image::load_from_memory(data)?;
    let cropped = center_square_crop(&img);
    let resized = cropped.resize_exact(AVATAR_SIZE, AVATAR_SIZE, FilterType::Lanczos3);
    let bytes = encode_webp(&resized)?;

    Ok(ProcessedImage { bytes, content_type: "image/webp" })
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
