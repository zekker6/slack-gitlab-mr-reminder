<div align="center">

# slack-gitlab-mr-reminder

[![npm version](https://badge.fury.io/js/%40zekker6%2Fslack-gitlab-mr-reminder.svg)](https://www.npmjs.com/package/@zekker6/slack-gitlab-mr-reminder)
[![Test Status](https://github.com/zekker6/slack-gitlab-mr-reminder/workflows/Testing/badge.svg)](https://github.com/zekker6/slack-gitlab-mr-reminder/actions?query=workflow%3ATesting)
[![Build Status](https://github.com/zekker6/slack-gitlab-mr-reminder/workflows/Build%20docker%20image/badge.svg)](https://github.com/zekker6/slack-gitlab-mr-reminder/actions)

[Docker image](https://github.com/zekker6/slack-gitlab-mr-reminder/pkgs/container/slack-gitlab-mr-reminder)

This node module can be used to send slack reminders for overdue gitlab merge requests. The criteria for this can be configured, but default is that:
- WIP merge requests not updated for longer than 7 day.
- Normal merge requests not updated for longer than 0 day (24 hours).

<img src="screenshot.png" width="500" height="auto"/>

</div>


## Installation
`
npm install @zekker6/slack-gitlab-mr-reminder
`

## Example - running as an application
Install the module globally

`
npm install -g @zekker6/slack-gitlab-mr-reminder
`

Call `slack-gitlab-mr-reminder` with a suitable `yml` config, gitlab access token and slack webhook. See [example.yml](examples/config.yml) for an example of config.

`
GITLAB_ACCESS_TOKEN='...' SLACK_WEBHOOK_URL='...' slack-gitlab-mr-reminder examples/config.yml 
`

This will only run once and send a reminder. You will likely want to run this everyday for which a cron would be suitable:

`
0 9 * * * GITLAB_ACCESS_TOKEN='...' SLACK_WEBHOOK_URL='...' slack-gitlab-mr-reminder /absolute/path/to/config.yml 
`

This will send out reminders every day at 9AM

## Example - module
You may use the functionality as a module:

```js
var SlackGitlabMRReminder = require('slack-gitlab-mr-reminder');

const reminder = new SlackGitlabMRReminder({
  mr: {
    wip_mr_days_threshold: 7,
    normal_mr_days_threshold: Infinity,
  },
  slack: {
    webhook_url: 'https://hooks.slack.com/services/...',
    channel: 'merge-requests',
  },
  gitlab: {
    access_token: '...',
    group: 'mygroup'
  }
});

reminder.remind();
```

## Example - docker

Launch with cron
```bash
# To configure via config file
docker run -v config.yml:/opt/config.yml --rm zekker6/slack-gitlab-mr-reminder:{TAG}

# Configuration via env parameters
docker run -e ... --rm zekker6/slack-gitlab-mr-reminder:{TAG}
```

One-time start
```bash

docker run --rm zekker6/slack-gitlab-mr-reminder:{TAG} remind
```

Supported env variables:
|Var|Default|Description|
|---|---|---|
| REMINDER_CRON_SCHEDULE | '* * * * *' | Cron expression to configure reminder starts |
| REMINDER_CONFIG_PATH | /opt/config.yml | Path to mounted config file |
| GITLAB_ACCESS_TOKEN | None | Gitlab access token |
| GITLAB_GROUP | None | Gitlab group name |
| GITLAB_EXTERNAL_URL | None | Gitlab installation url |
| GITLAB_WIP_MR_DAYS_THRESHOLD | 7 | Value in days representing threshold of notifying about stale MR |
| GITLAB_NORMAL_MR_DAYS_THRESHOLD | 0 | Value in days representing threshold of notifying about stale MR |
| SLACK_WEBHOOK_URL | None | Slack webhook to send notifications |
| SLACK_CHANNEL  | None | Slack channel name |

## Options

- `gitlab.group` - The name of the group to watch for merge requests - Required
- `gitlab.external_url` - The url of the gitlab installation - Defaults to https://gitlab.com (the public gitlab)

- `slack.channel` - The slack channel to post to - Required
- `slack.name` - Name of the slack poster - Defaults to `GitLab Reminder`
- `slack.message` - Message to send at the top of the slack message - Defaults to `Merge requests are overdue:`

It is possible to run app by using either config file or env variables.
Browse examples in examples folder: [here](examples/)
