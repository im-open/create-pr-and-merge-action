const github = require('@actions/github');
const core = require('@actions/core');

// When used, this requiredArgOptions will cause the action to error if a value has not been provided.
const requiredArgOptions = {
  required: true,
  trimWhitespace: true
};

const baseBranch = core.getInput('base-branch', requiredArgOptions);
const headBranch = core.getInput('head-branch', requiredArgOptions);
const repoName = core.getInput('repository-name') || github.context.repo.repo;
const ownerName = core.getInput('owner-name') || github.context.repo.owner;
const prTitle = core.getInput('pr-title', requiredArgOptions);
const gitHubToken = core.getInput('github-token', requiredArgOptions);
const patToken = core.getInput('pat-token', requiredArgOptions);

async function run() {
  const bot_octokit = github.getOctokit(gitHubToken);
  const reviewer_octokit = github.getOctokit(patToken);

  let prNumber;
  let hasError = false;
  await bot_octokit.rest.pulls
    .create({
      owner: ownerName,
      repo: repoName,
      base: baseBranch,
      head: headBranch,
      title: prTitle
    })
    .then(response => {
      prNumber = response.data.number;
      core.info(`The PR for increment-versions is ${prNumber}.`);
    })
    .catch(error => {
      hasError = true;
      core.setFailed(`An error occurred creating the pull request: ${error.message}`);
    });
  if (hasError) return;

  await reviewer_octokit.rest.pulls
    .createReview({
      owner: ownerName,
      repo: repoName,
      pull_number: prNumber,
      event: 'APPROVE'
    })
    .catch(error => {
      core.setFailed(`An error occurred while reviewing the pull request: ${error.message}`);
      hasError = true;
    });
  if (hasError) return;

  await reviewer_octokit.rest.pulls
    .merge({
      owner: ownerName,
      repo: repoName,
      pull_number: prNumber
    })
    .catch(error => {
      core.setFailed(`An error occurred while merging the pull request: ${error.message}`);
    });
}

run();
