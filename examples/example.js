var SlackGitlabMRReminder = require('slack-gitlab-mr-reminder');

const reminder = new SlackGitlabMRReminder({
  mr: {
    wip_mr_days_threshold: 7,
    normal_mr_days_threshold: 0,
  },
  slack: {
    webhook_url: 'https://hooks.slack.com/services/...',
    channel: 'merge-requests',
  },
  gitlab: {
    access_token: '...',
    group: 'mygroup',
    external_url: 'https://gitlab.company.com/'
  }
});

reminder.remind();