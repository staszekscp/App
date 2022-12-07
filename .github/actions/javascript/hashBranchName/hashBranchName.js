/* eslint-disable no-bitwise */
const core = require('@actions/core');

const branchPRTarget = core.getInput('BRANCH_PULL_REQUEST_TARGET');
const branchWorkflowDispatch = core.getInput('BRANCH_WORKFLOW_DISPATCH');

function hashCode(str) {
    // eslint-disable-next-line rulesdir/prefer-underscore-method
    return str.split('').reduce((prevHash, currVal) => (((prevHash << 5) - prevHash) + currVal.charCodeAt(0)) | 0, 0);
}

const hashBranchName = function () {
    if (branchPRTarget) {
        return hashCode(branchPRTarget);
    }
    return hashCode(branchWorkflowDispatch);
};

core.setOutput('BRANCH_NAME_HASH', `Branch${hashBranchName()}`);
