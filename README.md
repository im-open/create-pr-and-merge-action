# DEPRECATED

This action was deprecated on 2023-09-08 and will no longer receive support or updates.

# Create PR and Merge Build Change

A GitHub Action that creates a pull request for a provided branch with one account (usually the GitHub Actions bot), then approves the PR and merges it into another branch with a separate account.  The approval and merging is done via a Personal Access Token (PAT).

By default the PR is created in the repository where the workflow is running but it can be configured to create PRs in another repository.

## Index <!-- omit in toc -->

- [Create PR and Merge Build Change](#create-pr-and-merge-build-change)
  - [Inputs](#inputs)
  - [Usage Examples](#usage-examples)
    - [Creating a PR in the current repository](#creating-a-pr-in-the-current-repository)
    - [Creating a PR in another repository](#creating-a-pr-in-another-repository)
  - [Contributing](#contributing)
    - [Incrementing the Version](#incrementing-the-version)
    - [Source Code Changes](#source-code-changes)
    - [Recompiling Manually](#recompiling-manually)
    - [Updating the README.md](#updating-the-readmemd)
  - [Code of Conduct](#code-of-conduct)
  - [License](#license)
  
## Inputs

| Parameter         | Is Required | Description                                                                                                       |
|-------------------|-------------|-------------------------------------------------------------------------------------------------------------------|
| `base-branch`     | true        | The branch you want to merge changes into.                                                                        |
| `head-branch`     | true        | The branch that contains the changes you want to merge.                                                           |
| `repository-name` | true        | The name of the repository where the PR will be created.  Defaults to the repository where the action is used.    |
| `owner-name`      | true        | The owner (user or organization) of the target repo.  Defaults to the owner of the repo where the action is used. |
| `pr-title`        | true        | The title of the pull request.                                                                                    |
| `github-token`    | true        | The GitHub Action bot token used to create the PR.                                                                |
| `pat-token`       | true        | The token used to submit a review and merge the PR.                                                               |

## Usage Examples

### Creating a PR in the current repository

```yml
name: Create Release Notes
on: workflow_dispatch
jobs:
  add-release-notes-and-merge:
    runs-on: ubuntu-20.04
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Add release notes
        run: |
          git checkout -b release-note-update
          touch version-1.0.0_release-notes.txt
          git add .
          git commit -m "Adding release notes for version 1.0.0"

      - name: Merge Auto Generated Release Notes
        # You may also reference the major or major.minor version
        uses: im-open/create-pr-and-merge-action@v1.1.3
        with:
          base-branch: main
          head-branch: release-note-update
          pr-title: 'Auto-generated release note update for version 1.0.0'
          github-token: ${{ secrets.GITHUB_TOKEN }}
          pat-token: ${{ secrets.PAT }}
```

### Creating a PR in another repository

```yml
name: Sync template files
on: workflow_dispatch
jobs:
  add-release-notes-and-merge:
    runs-on: ubuntu-20.04
    steps:
      - name: Checkout this-repo
        uses: actions/checkout@v3
        with:
          repository: im-open/this-repo
          path: this-repo

      - name: Checkout secondary-repo
        uses: actions/checkout@v3
        with:
          repository: im-open/secondary-repo
          path: secondary-repo

      - name: Copy Templates
        run: |
          git checkout -b sync-templates
          cp -r this-repo/templates* secondary-repo/templates/
          git add .
          git commit -m "Copy templates from this-repo to secondary-repo"

      - name: Merge Auto Generated Release Notes
        # You may also reference the major or major.minor version
        uses: im-open/create-pr-and-merge-action@v1.1.3
        with:
          base-branch: main
          head-branch: sync-templates
          repository-name: secondary-repo
          owner-name: im-open
          pr-title: 'Auto-generated template sync from this-repo to secondary-repo'
          github-token: ${{ secrets.GITHUB_TOKEN }}
          pat-token: ${{ secrets.PAT }}
```

## Contributing

When creating PRs, please review the following guidelines:

- [ ] The action code does not contain sensitive information.
- [ ] At least one of the commit messages contains the appropriate `+semver:` keywords listed under [Incrementing the Version] for major and minor increments.
- [ ] The action has been recompiled.  See [Recompiling Manually] for details.
- [ ] The README.md has been updated with the latest version of the action.  See [Updating the README.md] for details.

### Incrementing the Version

This repo uses [git-version-lite] in its workflows to examine commit messages to determine whether to perform a major, minor or patch increment on merge if [source code] changes have been made.  The following table provides the fragment that should be included in a commit message to active different increment strategies.

| Increment Type | Commit Message Fragment                     |
|----------------|---------------------------------------------|
| major          | +semver:breaking                            |
| major          | +semver:major                               |
| minor          | +semver:feature                             |
| minor          | +semver:minor                               |
| patch          | *default increment type, no comment needed* |

### Source Code Changes

The files and directories that are considered source code are listed in the `files-with-code` and `dirs-with-code` arguments in both the [build-and-review-pr] and [increment-version-on-merge] workflows.  

If a PR contains source code changes, the README.md should be updated with the latest action version and the action should be recompiled.  The [build-and-review-pr] workflow will ensure these steps are performed when they are required.  The workflow will provide instructions for completing these steps if the PR Author does not initially complete them.

If a PR consists solely of non-source code changes like changes to the `README.md` or workflows under `./.github/workflows`, version updates and recompiles do not need to be performed.

### Recompiling Manually

This command utilizes [esbuild] to bundle the action and its dependencies into a single file located in the `dist` folder.  If changes are made to the action's [source code], the action must be recompiled by running the following command:

```sh
# Installs dependencies and bundles the code
npm run build
```

### Updating the README.md

If changes are made to the action's [source code], the [usage examples] section of this file should be updated with the next version of the action.  Each instance of this action should be updated.  This helps users know what the latest tag is without having to navigate to the Tags page of the repository.  See [Incrementing the Version] for details on how to determine what the next version will be or consult the first workflow run for the PR which will also calculate the next version.

## Code of Conduct

This project has adopted the [im-open's Code of Conduct](https://github.com/im-open/.github/blob/main/CODE_OF_CONDUCT.md).

## License

Copyright &copy; 2023, Extend Health, LLC. Code released under the [MIT license](LICENSE).

<!-- Links -->
[Incrementing the Version]: #incrementing-the-version
[Recompiling Manually]: #recompiling-manually
[Updating the README.md]: #updating-the-readmemd
[source code]: #source-code-changes
[usage examples]: #usage-examples
[build-and-review-pr]: ./.github/workflows/build-and-review-pr.yml
[increment-version-on-merge]: ./.github/workflows/increment-version-on-merge.yml
[esbuild]: https://esbuild.github.io/getting-started/#bundling-for-node
[git-version-lite]: https://github.com/im-open/git-version-lite
