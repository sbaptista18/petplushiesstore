function toKebabCase(str) {
  return str
    .replace(/[^\w\s]|_/g, "")
    .replace(/\s+/g, "-") // Replace whitespace with hyphens
    .replace(/([a-z])([A-Z])/g, "$1-$2") // Convert camelCase to kebab-case
    .toLowerCase(); // Convert to lowercase
}

export default toKebabCase;
