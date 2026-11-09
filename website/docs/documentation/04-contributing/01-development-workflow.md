# Development Workflow

This article explains the daily development workflow for contributors: from forking to merging changes.

Before you start, please read and abide by the [SAP Open Source Code of Conduct](https://github.com/SAP/.github/blob/main/CODE_OF_CONDUCT.md).

Before implementing a change, please create an issue that describes the problem you would like to solve or the enhancement you would like to make, and note that you are willing to work on it. The team will review the issue and, if accepted, assign it to you. See the repository's [CONTRIBUTING.md](https://github.com/UI5/webcomponents-geomap/blob/main/CONTRIBUTING.md) for the full contribution policy.

## 1. Fork the UI5 Geomap repository

See how to fork a repo [here](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo).

## 2. Clone the UI5 Geomap repository

See how to clone a repo [here](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository).

## 3. Run the project

**3.0.** Make sure you have [Node.js](https://nodejs.org/) installed (**version 18 or higher**).

**3.1.** Install all dependencies. This also installs the Git hooks (via `husky`) that lint your commit messages.

```sh
npm install
```

**3.2.** Build and serve the project.

```sh
npm start
```

Once the project is served, the dev server opens in your browser automatically, usually at:
 - http://localhost:8080/

The dev server reloads the pages whenever you make changes in the code.

**3.3.** To run the documentation website (docs, API reference and samples) locally, start it from the `website` folder:

```sh
cd website
npm install
npm run start:website
```

This builds the components, generates the API reference, and starts the website in your browser. See [Running the Website](04-website.md) for more details.

## 4. Develop

**4.1.** Read the [Conventions and Guidelines](02-conventions-and-guidelines.md) before you start.

**4.2.** Create a local branch within your fork and work with it as usual.

**4.3.** Before committing, run the linter to check your code against the project ESLint configuration.

```sh
npm run lint
```

You can automatically fix most issues with:

```sh
npm run lintfix
```

**4.4.** Before committing, run the tests to catch issues as early as possible.

```sh
npm test
```

For the Cypress component/integration tests:

```sh
npm run test:cypress
```

**4.5.** When committing, follow the [Conventional Commits](https://www.conventionalcommits.org/) format. Commit messages are linted automatically by a `commit-msg` Git hook (installed during `npm install`), and a badly-formatted message will be rejected.

```sh
git commit -m "fix(cluster): avoid crash when source has zero features"
```

See the [Git Guidelines](02-conventions-and-guidelines.md#git-guidelines) for the allowed commit types and full rules.

## 5. Open a pull request (PR) from your fork

You can open a pull request to the upstream repository from any branch or commit in your fork.
We recommend that you make changes in a topic branch (not in your local `main` branch), so that you can push follow-up commits if you receive feedback on your pull request.

**5.1.** Find the "Pull requests" tab and press the "New pull request" button.

**5.2.** Compare the `main` branch of the upstream repository with a branch from your fork.

**Note:** The full guide on how to open a PR from a fork can be found [here](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request-from-a-fork).

**5.3.** Once the PR is created, you will be asked to accept a Developer Certificate of Origin (DCO). Just follow the link posted in the PR by the CLA assistant.

**Note:** This is required only for your first PR.

**5.4.** Immediately after the PR is created, a central build process starts to verify the change by building the project and running all tests.

**5.5.** Wait for our code review and approval. After the PR is approved, the UI5 Geomap team will merge the change into the `main` branch.

## 6. Sync your fork

Over time your fork will get out of sync with the original repository and you will need to update it.

**6.1.** Specify the upstream repository that your fork will be synced with.

```sh
git remote add upstream https://github.com/UI5/webcomponents-geomap.git
```

**6.2.** Fetch the branches and their respective commits from the upstream repository.

```sh
git fetch upstream
```

**6.3.** Check out your fork's local `main` branch.

```sh
git checkout main
```

**6.4.** Merge the changes from `upstream/main` into your local `main` branch.

```sh
git merge upstream/main
```

**Note:** The full guide on how to sync a fork can be found [here](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/syncing-a-fork).
