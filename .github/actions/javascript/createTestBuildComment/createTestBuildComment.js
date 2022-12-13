const core = require('@actions/core');
const {context} = require('@actions/github');
const GithubUtils = require('../../../libs/GithubUtils');

/**
 * @param {String} status
 * @param {String} link
 * @returns {String}
 */
function getQRCode(status, link) {
    if (status === 'success') {
        return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${link}`;
    }
    return 'This build has failed, therefore no QR code could be generated.';
}

const prNumber = core.getInput('PULL_REQUEST_NUMBER', {required: true});

const androidResult = core.getInput('ANDROID', {required: true});
const desktopResult = core.getInput('DESKTOP', {required: true});
const iOSResult = core.getInput('IOS', {required: true});

// const webResult = core.getInput('WEB', {required: true});

const androidLink = androidResult === 'success' ? core.getInput('ANDROID_LINK', {required: false}) : 'FAILED ❌';
const desktopLink = desktopResult === 'success' ? core.getInput('DESKTOP_LINK', {required: false}) : 'FAILED ❌';
const iOSLink = iOSResult ? core.getInput('IOS_LINK', {required: false}) : 'FAILED ❌';

// const webLink = webResult ? core.getInput('WEB_LINK', {required: false}) : 'FAILED ❌';

const commentMessage = `:test_tube::test_tube: Use the links below to test this build in android and iOS. Happy testing! :test_tube::test_tube:\n
    | android :robot:  | iOS :apple: | desktop :computer: |\n
    | ------------- | ------------- | ------------- |\n
    | ${androidLink}  | ${iOSLink}  | ${desktopLink} |\n
    | ![Android](${getQRCode(androidResult, androidLink)}) | ![iOS](${getQRCode(iOSResult, iOSLink)}) | ![desktop](${getQRCode(desktopResult, desktopLink)}) |`;

/**
 * Comment Single PR
 *
 * @param {Number} PR
 * @param {String} message
 * @returns {Promise<void>}
 */
function commentPR(PR, message) {
    return GithubUtils.createComment(context.repo.repo, PR, message)
        .then(() => console.log(`Comment created on #${PR} successfully 🎉`))
        .catch((err) => {
            console.log(`Unable to write comment on #${PR} 😞`);
            core.setFailed(err.message);
        });
}

const run = function () {
    return commentPR(prNumber, commentMessage);
};

run();

module.exports = run;
