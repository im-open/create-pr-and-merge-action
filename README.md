# Create PR and Merge Build Change

A GitHub Action that creates a pull request for a provided branch, approves it, and merges the change to the default branch. The approval and merging is done via a Personal Access Token (PAT).

## Inputs

| Parameter                   | Is Required   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `base-branch`               | true     |  The branch you want to merge changes into.                                                             |
| `head-branch`               | true     |  The branch that contains the changes you want to merge.                                                |
| `pr-title`                  | true     |  The title of the pull request.                                                                         |
| `github-token`              | true     |  The token that GitHub actions can use to create the PR.                                                |
| `pat-token`                 | true     |  The token used to submit a review and merge the PR.                                                    |

## Recompiling

If changes are made to the action's code in this repository, or its dependencies, you will need to re-compile the action.

```
# Installs dependencies and bundles the code
npm run build

# Bundle the code (if dependencies are already installed)
npm run bundle
```

These commands utilize [esbuild](https://esbuild.github.io/getting-started/#bundling-for-node) to bundle the action and its dependencies into a single file located in the `dist` folder.