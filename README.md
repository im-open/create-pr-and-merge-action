# Create PR and Merge Build Change

A GitHub Action that creates a pull request for a provided branch with one account (usually the GitHub Actions bot), then approves the PR and merges it into another branch with a separate account.  The approval and merging is done via a Personal Access Token (PAT).

By default the PR is created in the repository where the workflow is running but it can be configured to create PRs in another repository.
    
## Index 

- [Inputs](#inputs)
- [Example](#example)
  - [Creating a PR in the current repository](#creating-a-pr-in-the-current-repository)
  - [Creating a PR in another repository](#creating-a-pr-in-another-repository)
- [Contributing](#contributing)
  - [Recompiling](#recompiling)
  - [Incrementing the Version](#incrementing-the-version)
- [Code of Conduct](#code-of-conduct)
- [License](#license)
  
## Inputs

| Parameter         | Is Required | Description                                                                                                       |
| ----------------- | ----------- | ----------------------------------------------------------------------------------------------------------------- |
| `base-branch`     | true        | The branch you want to merge changes into.                                                                        |
| `head-branch`     | true        | The branch that contains the changes you want to merge.                                                           |
| `repository-name` | true        | The name of the repository where the PR will be created.  Defaults to the repository where the action is used.    |
| `owner-name`      | true        | The owner (user or organization) of the target repo.  Defaults to the owner of the repo where the action is used. |
| `pr-title`        | true        | The title of the pull request.                                                                                    |
| `github-token`    | true        | The GitHub Action bot token used to create the PR.                                                                |
| `pat-token`       | true        | The token used to submit a review and merge the PR.                                                               |

## Example

### Creating a PR in the current repository
```yml
name: Create Release Notes
on: workflow_dispatch
jobs:
  add-release-notes-and-merge:
    runs-on: ubuntu-20.04
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - name: Add release notes
        run: |
          git checkout -b release-note-update
          touch version-1.0.0_release-notes.txt
          git add .
          git commit -m "Adding release notes for version 1.0.0"

      - name: Merge Auto Generated Release Notes
        uses: im-open/create-pr-and-merge-action@v1.0.6
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
        uses: actions/checkout@v2
        with:
          repository: im-open/this-repo
          path: this-repo

      - name: Checkout secondary-repo
        uses: actions/checkout@v2
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
        uses: im-open/create-pr-and-merge-action@v1.0.6
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

When creating new PRs please ensure:
1. The action has been recompiled.  See the [Recompiling](#recompiling) section below for more details.
2. For major or minor changes, at least one of the commit messages contains the appropriate `+semver:` keywords listed under [Incrementing the Version](#incrementing-the-version).
3. The `README.md` example has been updated with the new version.  See [Incrementing the Version](#incrementing-the-version).
4. The action code does not contain sensitive information.

### Recompiling

If changes are made to the action's code in this repository, or its dependencies, you will need to re-compile the action.

```sh
# Installs dependencies and bundles the code
npm run build

# Bundle the code (if dependencies are already installed)
npm run bundle
```

These commands utilize [esbuild](https://esbuild.github.io/getting-started/#bundling-for-node) to bundle the action and
its dependencies into a single file located in the `dist` folder.

### Incrementing the Version

This action uses [git-version-lite] to examine commit messages to determine whether to perform a major, minor or patch increment on merge.  The following table provides the fragment that should be included in a commit message to active different increment strategies.
| Increment Type | Commit Message Fragment                     |
| -------------- | ------------------------------------------- |
| major          | +semver:breaking                            |
| major          | +semver:major                               |
| minor          | +semver:feature                             |
| minor          | +semver:minor                               |
| patch          | *default increment type, no comment needed* |

## Code of Conduct

This project has adopted the [im-open's Code of Conduct](https://github.com/im-open/.github/blob/master/CODE_OF_CONDUCT.md).

## License

Copyright &copy; 2021, Extend Health, LLC. Code released under the [MIT license](LICENSE).

[git-version-lite]: https://github.com/im-open/git-version-lite
