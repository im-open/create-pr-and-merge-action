# Create PR and Merge Build Change

A GitHub Action that creates a pull request for a provided branch with one account (usually the GitHub Actions bot), then approves the PR and merges it into another branch with a separate account.  The approval and merging is done via a Personal Access Token (PAT).

## Inputs

| Parameter                   | Is Required   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `base-branch`               | true     |  The branch you want to merge changes into.                                                             |
| `head-branch`               | true     |  The branch that contains the changes you want to merge.                                                |
| `pr-title`                  | true     |  The title of the pull request.                                                                         |
| `github-token`              | true     |  The GitHub Action bot token used to create the PR.                                                |
| `pat-token`                 | true     |  The token used to submit a review and merge the PR.                                                    |

## Example

```yml
name: Map project versions
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

## Recompiling

If changes are made to the action's code in this repository, or its dependencies, you will need to re-compile the action.

```
# Installs dependencies and bundles the code
npm run build

# Bundle the code (if dependencies are already installed)
npm run bundle
```

These commands utilize [esbuild](https://esbuild.github.io/getting-started/#bundling-for-node) to bundle the action and its dependencies into a single file located in the `dist` folder.
