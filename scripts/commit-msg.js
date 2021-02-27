#!/usr/bin/env node

/**
 * https://medium.com/@Sergeon/using-javascript-in-your-git-hooks-f0ce09477334
 * This code will ensure that before every commit in your client repository, your branch name and commit message adheres to a certain contract.
 * In this example, branch names must be like 'feature/AP-22-some-feature-name' or 'hotfix/AP-30-invitation-email-not-sending', and commit messages must start like some issue code, like AP-100 or AP-101.
 *
 * 'AP' just stands for Acme Platform and is an example. I made this example with Jira in mind, since Jira issue codes have this structure -as far as I know-, but is pretty easy to change it to any other issue id like #100 or $-AP-120, or whatever.
 *
 * In order for this to work, you should go to .git/hooks in any git client repository and create a commit-msg file (or modify the provided by default, commit-msg.sample) with
 * this contents.
 *
 * You need an await/async compliant version of node installed in your machine.
 *
 * Don't forget to make your file executable!
 */

const fs = require('fs')
const childProcessExec = require('child_process').exec
const util = require('util')
// const BRANCH_CONTRACT = Object.freeze(/^(feature|hotfix)\/.+/)
const BRANCH_CONTRACT = Object.freeze(/^.+/) // currently no contract
const CODE_CONTRACT = Object.freeze(/^(revert: )?(feat|fix|docs|style|refactor|test|wip|chore)(\(.+\))?: .{1,50}/)
const TIMEOUT_THRESHOLD = 3000

const exec = util.promisify(childProcessExec)

checkCommitMessage()
hookCleanup()

async function checkCommitMessage() {
  console.log('Running commit-msg hook')

  const commitMsgFileName = process.argv[2]
  const message = fs.readFileSync(commitMsgFileName, 'utf8').trim()
  let branchName = ''
  try {
    branchName = await getCurrentBranch()
  } catch (e) {
    handleGitBranchCommandError(e)
  }

  if (!BRANCH_CONTRACT.test(branchName)) {
    handleBadBranchName()
  }

  if (!CODE_CONTRACT.test(message)) {
    handleBadCommitMessage()
  }
  process.exit(0)
}

async function getCurrentBranch() {
  const branchesOutput = await exec('git branch')
  if (branchesOutput.stderr) {
    throw new Error(stderr)
  }
  const branches = branchesOutput.stdout
  return branches.split('\n').find(b => b.trim().charAt(0) === '*').trim().substring(2)
}

function handleGitBranchCommandError(e) {
  console.log('Something bad happened when trying to read the repository branches using the "git branch" command')
  console.log('This script is intended to be run as a git hook inside a git repository. Are you sure you\'re calling it properly?')
  console.log('The error provided by the "git branch" invocation was the following:')
  console.log(e.getMessage())
  console.log('----')
  console.log('Your commit will be rejected. This script will terminate.')
  process.exit(1)
}

function handleBadBranchName() {
  console.log(`There is something wrong with your branch name.
Branch names in this project must adhere to this contract: ${BRANCH_CONTRACT}.
They must start either with "feature" or "hotfix", followed by "/".

   Example Branch Name: feature/a-great-feature

Your commit will be rejected. You should rename your branch to a valid name. For instance, you could run a command like the following to rename your branch:

  git branch -m feature/a-great-feature

If you think there is something wrong with this message, or that your branch name is not being validated properly, check the commit-msg git hook.
  `)
  process.exit(1)
}

function handleBadCommitMessage() {
  console.log(`There is something wrong with your commit message.
It should adhere to this contract: ${CODE_CONTRACT}.

     Example Commit Message:
     Header:   |  feat(cat-builder): Add New Layout Section
     (empty)   |
     Body:     |  Add workarea, config, and control panels
               |  Add basic drag and drop for initial elements
     (empty)   |
     Footer:   |  [ch101]

Your commit will be rejected. Please re-commit your work with a proper commit message.
If you thing there is something wrong with this message, or that your commit message is not being validated properly, check the commit-msg git hook.
  `)
  process.exit(1)
}

function hookCleanup() {
  setTimeout(() => {
    console.log('This is a timeout message from your commit-msg git hook. If you see this, something bad happened in your pre-commit hook, and it absolutely did not work as expected.')
    console.log('Your commit will be rejected. Please read any previous error message related to your commit message and/or check the commit-msg git hook script.')
    console.log('You can find more info in this link: https://git-scm.com/book/uz/v2/Customizing-Git-An-Example-Git-Enforced-Policy.')
    process.exit(1)
  }, TIMEOUT_THRESHOLD)
}
