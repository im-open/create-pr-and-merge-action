# Create PR and Merge Build Change

A GitHub Action that creates a pull request for a provided branch with one account (usually the GitHub Actions bot), then approves the PR and merges it into another branch with a separate account.  The approval and merging is done via a Personal Access Token (PAT).

By default the PR is created in the repository where the workflow is running but it can be configured to create PRs in another repsitory.

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
        uses: im-open/create-pr-and-merge-action@v1
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
        uses: im-open/create-pr-and-merge-action@v1.0.1
        with:
          base-branch: main
          head-branch: sync-templates
          repository-name: secondary-repo
          owner-name: im-open
          pr-title: 'Auto-generated template sync from this-repo to secondary-repo'
          github-token: ${{ secrets.GITHUB_TOKEN }}
          pat-token: ${{ secrets.PAT }}
```

## Recompiling

If changes are made to the action's code in this repository, or its dependencies, you will need to re-compile the action.

```
# Installs dependencies and bundles the code
npm run build

# Bundle the code (if dependencies are already installed)
npm run bundle
```

These commands utilize [esbuild](https://esbuild.github.io/getting-started/#bundling-for-node) to bundle the action and its dependencies into a single file located in the `dist` folder.
