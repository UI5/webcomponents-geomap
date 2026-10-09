# Contributing

## Code of Conduct

All members of the project community must abide by the [SAP Open Source Code of Conduct](https://github.com/SAP/.github/blob/main/CODE_OF_CONDUCT.md).
Only by respecting each other we can develop a productive, collaborative community.
Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting [a project maintainer](.reuse/dep5).

## Engaging in Our Project

We use GitHub to manage reviews of pull requests.

* If you are a new contributor, see: [Steps to Contribute](#steps-to-contribute)

* Before implementing your change, create an issue that describes the problem you would like to solve or the code that should be enhanced. Please note that you are willing to work on that issue.

* The team will review the issue and decide whether it should be implemented as a pull request. In that case, they will assign the issue to you. If the team decides against picking up the issue, the team will post a comment with an explanation.

## Steps to Contribute

Should you wish to work on an issue, please claim it first by commenting on the GitHub issue that you want to work on. This is to prevent duplicated efforts from other contributors on the same issue.

If you have questions about one of the issues, please comment on them, and one of the maintainers will clarify.

## Contributing Code or Documentation

You are welcome to contribute code in order to fix a bug or to implement a new feature that is logged as an issue.

The following rule governs code contributions:

* Contributions must be licensed under the [Apache 2.0 License](./LICENSE)
* Due to legal reasons, contributors will be asked to accept a Developer Certificate of Origin (DCO) when they create the first pull request to this project. This happens in an automated fashion during the submission process. SAP uses [the standard DCO text of the Linux Foundation](https://developercertificate.org/).

## Issues and Planning

* We use GitHub issues to track bugs and enhancement requests.

* Please provide as much context as possible when you open an issue. The information you provide must be comprehensive enough to reproduce that issue for the assignee.

## Commit Messages

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
