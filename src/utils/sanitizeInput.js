import DOMPurify from "dompurify";

export function sanitizeInput(input) {
  return DOMPurify.sanitize(input.trim(), {
    ALLOWED_TAGS: [], // Remove all HTML tags
    ALLOWED_ATTR: [], // Remove all attributes
  });
}
