/**
 * Webpack loader that replaces `import.meta.url` references in playground-elements
 * with a URL pointing to the static/playground-elements/ directory.
 *
 * Without this, webpack replaces import.meta.url with a file:// path that browsers
 * can't fetch, breaking the TypeScript worker loading in playground-project.js.
 */
module.exports = function (source) {
  const baseUrl = this.getOptions().baseUrl || '/';
  const replacement = `new URL("${baseUrl}playground-elements/playground-project.js", typeof window !== "undefined" ? window.location.origin : "http://localhost").href`;
  return source.replace(/import\.meta\.url/g, replacement);
};
