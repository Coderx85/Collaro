
/**
 * Converts a given text to a URL-friendly slug format.
 * @param text The text to be converted to a slug.
 * @returns The URL-friendly slug.
 * 
 * @example
 * convertToSlug("My Workspace Name");
 * // Returns: "my_workspace_name"
 */
export function convertToSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "_") // Replace spaces and non-word characters with underscores
    .replace(/^-+|-+$/g, ""); // Remove leading and trailing underscores
}