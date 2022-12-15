const GithubUtils = require('../../../libs/GithubUtils');

const run = () => GithubUtils.getContributorList().then((data) => {
    console.log(data);
    return data;
});

run();

module.exports = run;
