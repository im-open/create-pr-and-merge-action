const github = require('@actions/github');
const core = require('@actions/core');

const baseBranch = core.getInput('base-branch');
const headBranch = core.getInput('head-branch');
let repoName = core.getInput('repository-name');
let ownerName = core.getInput('owner-name');
const prTitle = core.getInput('pr-title');
const gitHubToken = core.getInput('github-token');
const patToken = core.getInput('pat-token');

async function run() {
  const context = github.context;
  const actionsOctokit = github.getOctokit(gitHubToken);
  const patTokenOctokit = github.getOctokit(patToken);

  if (!repoName || repoName.length < 1) repoName = context.repo.repo;
  if (!ownerName || ownerName.length < 1) ownerName = context.repo.owner;

  let prNumber = 0;
  try {
    const { data: prResult } = await actionsOctokit.pulls.create({
      owner: ownerName,
      repo: repoName,
      base: baseBranch,
      head: headBranch,
      title: prTitle
    });

    prNumber = prResult.number;
    core.info(`The PR for increment-versions is ${prNumber}.`);
  } catch (e) {
    core.setFailed(`An error occurred creating the pull request: ${e}`);
    return;
  }

  try {
    await patTokenOctokit.pulls.createReview({
      owner: ownerName,
      repo: repoName,
      pull_number: prNumber,
      event: 'APPROVE'
    });
  } catch (e) {
    core.setFailed(`An error occurred while reviewing the pull request: ${e}`);
    return;
  }

  try {
    await patTokenOctokit.pulls.merge({
      owner: ownerName,
      repo: repoName,
      pull_number: prNumber
    });
  } catch (e) {
    core.setFailed(`An error occurred while merging the pull request: ${e}`);
    return;
  }
}

run();
