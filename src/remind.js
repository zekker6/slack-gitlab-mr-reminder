#!/usr/bin/env node
var yaml = require('js-yaml');
var fs = require('fs');
var SlackGitlabMRReminder = require('./slack-gitlab-mr-reminder');

const optionsFile = process.argv[2];

let options = {
    mr: {},
    slack: {},
    gitlab: {}
};

if (fs.existsSync(optionsFile)) {
    options = yaml.safeLoad(fs.readFileSync(optionsFile, 'utf-8'));
}

options.slack.webhook_url = options.slack.webhook_url || process.env['SLACK_WEBHOOK_URL'];
options.slack.channel = options.slack.channel || process.env['SLACK_CHANNEL'];

options.gitlab.access_token = options.gitlab.access_token || process.env['GITLAB_ACCESS_TOKEN'];
options.gitlab.group = options.gitlab.group || process.env['GITLAB_GROUP'];
options.gitlab.external_url = options.gitlab.external_url|| process.env['GITLAB_EXTERNAL_URL'];

options.mr.normal_mr_days_threshold = options.gitlab.normal_mr_days_threshold || process.env['GITLAB_NORMAL_MR_DAYS_THRESHOLD'];
options.mr.wip_mr_days_threshold = options.gitlab.wip_mr_days_threshold || process.env['GITLAB_WIP_MR_DAYS_THRESHOLD'];


if (process.env['REMINDER_DEBUG']) {
    console.log('Parsed options: ' + JSON.stringify(options));
    console.log('Env options: ' + JSON.stringify(process.env));
}

const reminder = new SlackGitlabMRReminder(options);

reminder.remind();