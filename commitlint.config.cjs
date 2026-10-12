module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Disable line-length limits on commit body and footer.
    // Rationale: both humans writing long rationale/descriptions and
    // bots like Dependabot (which emit multi-line YAML blocks and
    // "Signed-off-by" trailers) regularly produce lines over 100 chars.
    // Wrapping would hurt readability for humans and is impossible to
    // enforce on bot-authored commits.
    "body-max-line-length": [0, "always"],
    "footer-max-line-length": [0, "always"],
  },
};
