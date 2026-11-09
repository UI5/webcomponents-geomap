# Conventions and Guidelines

## Code Style

We enforce code style rules using [ESLint](https://eslint.org). Run `npm run lint` to check your code for style issues, or `npm run lintfix` to automatically fix most of them.
You can find an ESLint integration for your favorite IDE [here](https://eslint.org/docs/user-guide/integrations).

## Testing

Tests are implemented with [Cypress](https://www.cypress.io/). Run `npm test` for the standard test suite, or `npm run test:cypress` to run the Cypress component/integration tests. If reasonable, take the time to write a test for the proposed change or fix.

## Git Guidelines

This repository follows the [Conventional Commits](https://www.conventionalcommits.org/) specification. Commit messages are linted locally via a `commit-msg` Git hook (installed automatically by `npm install`) and are the sole input used to compute the next release version and changelog entry.

### Format

```
<type>(<optional scope>): <short summary>

<optional body>

<optional footer(s)>
```

### Allowed types

| Type | Purpose | Triggers release? |
|---|---|---|
| `feat` | A new user-facing feature | yes — minor bump |
| `fix` | A bug fix | yes — patch bump |
| `perf` | A change that improves performance | yes — patch bump |
| `refactor` | Internal refactor, no behavior change | no |
| `docs` | Documentation only | no |
| `test` | Adding or fixing tests | no |
| `build` | Build system or external dependency changes | no |
| `ci` | CI configuration changes | no |
| `chore` | Housekeeping that doesn't fit the above | no |
| `revert` | Reverts a previous commit | yes — matches the reverted commit |

### Breaking changes

Append `!` after the type/scope and/or add a `BREAKING CHANGE:` footer:

```
feat(api)!: rename "layers" prop to "sources"

BREAKING CHANGE: The <ui5-geomap> "layers" attribute has been
renamed to "sources". Migration: s/layers=/sources=/.
```

While the package is on `0.x`, breaking changes bump the **minor** version (per SemVer). From `1.0.0` onward they bump the **major**.

### Examples

```
feat: expose onFeatureClick event
fix(cluster): avoid crash when source has zero features
docs: clarify installation step
chore(deps): bump maplibre-gl to 5.25.0
```
