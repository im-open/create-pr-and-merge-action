const github = require("@actions/github");
const core = require("@actions/core");

const baseBranch = core.getInput("base-branch");
const headBranch = core.getInput("head-branch");
const prTitle = core.getInput("pr-title");
const gitHubToken = core.getInput("github-token");
const patToken = core.getInput("pat-token");

async function run() {
  const context = github.context;
  const actionsOctokit = github.getOctokit(gitHubToken);
  const patTokenOctokit = github.getOctokit(patToken);

  let prNumber = 0;
  try {
    const { data: prResult } = await actionsOctokit.pulls.create({
      owner: context.repo.owner,
      repo: context.repo.repo,
      base: baseBranch,
      head: headBranch,
      title: prTitle,
    });

    prNumber = prResult.number;
    core.info(`The PR for increment-versions is ${prNumber}.`);
  } catch (e) {
    core.setFailed(`An error occurred creating the pull request: ${e}`);
    return;
  }

  try {
    await patTokenOctokit.pulls.createReview({
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: prNumber,
      event: "APPROVE",
    });
  } catch (e) {
    core.setFailed(`An error occurred while reviewing the pull request: ${e}`);
    return;
  }

  try {
    await patTokenOctokit.pulls.merge({
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: prNumber,
    });
  } catch (e) {
    core.setFailed(`An error occurred while merging the pull request: ${e}`);
    return;
  }
}

run();
