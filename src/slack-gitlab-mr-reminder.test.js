const SlackGitlabMRReminder = require('./slack-gitlab-mr-reminder');
const moment = require('moment');

const mock_options = {
  slack: {
    webhook_url: 'hook',
    channel: 'merge-requests',
  },
  gitlab: {
    access_token: 'token',
    group: 'mygroup'
  }
};

const mock_merge_requests = [
  {
    id: 1,
    title: 'MR1',
    description: 'MR1 description',
    author: {
      name: 'person'
    },
    web_url: 'https://gitlab.com/merge/1',
    draft: false,
    updated_at: 1234567
  },
  {
    id: 2,
    title: 'MR2',
    description: 'MR2 description',
    author: {
      name: 'person'
    },
    web_url: 'https://gitlab.com/merge/2',
    draft: false,
    updated_at: moment()
      .subtract(4, 'days')
      .toDate()
  },
  {
    id: 3,
    title: 'WIP: MR3',
    description: 'WIP MR with :',
    author: {
      name: 'person'
    },
    web_url: 'https://gitlab.com/merge/3',
    draft: false,
    updated_at: moment()
      .subtract(10, 'days')
      .toDate()
  },
  {
    id: 4,
    title: '[WIP] MR4',
    description: 'WIP MR with []',
    author: {
      name: 'person'
    },
    web_url: 'https://gitlab.com/merge/4',
    draft: false,
    updated_at: moment()
      .subtract(10, 'days')
      .toDate()
  },
  {
    id: 5,
    title: 'wIp: MR5',
    description: 'WIP MR with : and case-insensitive',
    author: {
      name: 'person'
    },
    web_url: 'https://gitlab.com/merge/5',
    draft: false,
    updated_at: moment()
      .subtract(10, 'days')
      .toDate()
  },
  {
    id: 5,
    title: '[wiP] MR6',
    description: 'WIP MR with [] and case-insensitive',
    author: {
      name: 'person'
    },
    web_url: 'https://gitlab.com/merge/6',
    draft: false,
    updated_at: moment()
      .subtract(10, 'days')
      .toDate()
  },
  {
    id: 7,
    title: 'Draft: MR7',
    description: 'Draft MR with title prefix',
    author: {
      name: 'person'
    },
    web_url: 'https://gitlab.com/merge/7',
    draft: true,
    updated_at: moment()
      .subtract(10, 'days')
      .toDate()
  },
  {
    id: 8,
    title: 'MR8 normal title',
    description: 'Draft MR via API field only',
    author: {
      name: 'person'
    },
    web_url: 'https://gitlab.com/merge/8',
    draft: true,
    updated_at: moment()
      .subtract(10, 'days')
      .toDate()
  }
];

test('merge requests reminder is sent', async () => {
  var reminder = new SlackGitlabMRReminder(mock_options);
  reminder.gitlab.getGroupMergeRequests = jest.fn(() => {
    return new Promise((resolve, reject) => {
      process.nextTick(() => {
        resolve(mock_merge_requests);
      });
    });
  });
  const result = await reminder.remind();
  expect(result).toBe('Reminder sent');
  expect(reminder.webhook.send).toHaveBeenCalledTimes(1);
  expect(reminder.webhook.send.mock.calls[0][0]).toEqual({
    attachments: [
      {
        author_name: 'person',
        color: '#FC6D26',
        text: 'MR1 description',
        title: 'MR1',
        title_link: 'https://gitlab.com/merge/1'
      },
      {
        author_name: 'person',
        color: '#FC6D26',
        text: 'MR2 description',
        title: 'MR2',
        title_link: 'https://gitlab.com/merge/2'
      },
      {
        author_name: 'person',
        color: '#FC6D26',
        text: 'WIP MR with :',
        title: 'WIP: MR3',
        title_link: 'https://gitlab.com/merge/3'
      },
      {
        author_name: 'person',
        color: '#FC6D26',
        text: 'WIP MR with []',
        title: '[WIP] MR4',
        title_link: 'https://gitlab.com/merge/4'
      },
      {
        author_name: 'person',
        color: '#FC6D26',
        text: 'WIP MR with : and case-insensitive',
        title: 'wIp: MR5',
        title_link: 'https://gitlab.com/merge/5'
      },
      {
        author_name: 'person',
        color: '#FC6D26',
        text: 'WIP MR with [] and case-insensitive',
        title: '[wiP] MR6',
        title_link: 'https://gitlab.com/merge/6'
      },
      {
        author_name: 'person',
        color: '#FC6D26',
        text: 'Draft MR with title prefix',
        title: 'Draft: MR7',
        title_link: 'https://gitlab.com/merge/7'
      },
      {
        author_name: 'person',
        color: '#FC6D26',
        text: 'Draft MR via API field only',
        title: 'MR8 normal title',
        title_link: 'https://gitlab.com/merge/8'
      }
    ],
    text: 'Merge requests are overdue:'
  });
});

test('merge requests (normal older than 5 days and all WIP) reminder is sent', async () => {
  var reminder = new SlackGitlabMRReminder(
    Object.assign(mock_options, {
      mr: {
        normal_mr_days_threshold: 5,
        wip_mr_days_threshold: 0
      }
    })
  );
  reminder.gitlab.getGroupMergeRequests = jest.fn(() => {
    return new Promise((resolve, reject) => {
      process.nextTick(() => {
        resolve(mock_merge_requests);
      });
    });
  });
  const result = await reminder.remind();
  expect(result).toBe('Reminder sent');
  expect(reminder.webhook.send).toHaveBeenCalledTimes(1);
  expect(reminder.webhook.send.mock.calls[0][0]).toEqual({
    attachments: [
      {
        author_name: 'person',
        color: '#FC6D26',
        text: 'MR1 description',
        title: 'MR1',
        title_link: 'https://gitlab.com/merge/1'
      },
      {
        author_name: 'person',
        color: '#FC6D26',
        text: 'WIP MR with :',
        title: 'WIP: MR3',
        title_link: 'https://gitlab.com/merge/3'
      },
      {
        author_name: 'person',
        color: '#FC6D26',
        text: 'WIP MR with []',
        title: '[WIP] MR4',
        title_link: 'https://gitlab.com/merge/4'
      },
      {
        author_name: 'person',
        color: '#FC6D26',
        text: 'WIP MR with : and case-insensitive',
        title: 'wIp: MR5',
        title_link: 'https://gitlab.com/merge/5'
      },
      {
        author_name: 'person',
        color: '#FC6D26',
        text: 'WIP MR with [] and case-insensitive',
        title: '[wiP] MR6',
        title_link: 'https://gitlab.com/merge/6'
      },
      {
        author_name: 'person',
        color: '#FC6D26',
        text: 'Draft MR with title prefix',
        title: 'Draft: MR7',
        title_link: 'https://gitlab.com/merge/7'
      },
      {
        author_name: 'person',
        color: '#FC6D26',
        text: 'Draft MR via API field only',
        title: 'MR8 normal title',
        title_link: 'https://gitlab.com/merge/8'
      }
    ],
    text: 'Merge requests are overdue:'
  });
});

test('merge requests (all normal and no WIP) reminder is sent', async () => {
  var reminder = new SlackGitlabMRReminder(
    Object.assign(mock_options, {
      mr: {
        normal_mr_days_threshold: 0,
        wip_mr_days_threshold: 30
      }
    })
  );
  reminder.gitlab.getGroupMergeRequests = jest.fn(() => {
    return new Promise((resolve, reject) => {
      process.nextTick(() => {
        resolve(mock_merge_requests);
      });
    });
  });
  const result = await reminder.remind();
  expect(result).toBe('Reminder sent');
  expect(reminder.webhook.send).toHaveBeenCalledTimes(1);
  expect(reminder.webhook.send.mock.calls[0][0]).toEqual({
    attachments: [
      {
        author_name: 'person',
        color: '#FC6D26',
        text: 'MR1 description',
        title: 'MR1',
        title_link: 'https://gitlab.com/merge/1'
      },
      {
        author_name: 'person',
        color: '#FC6D26',
        text: 'MR2 description',
        title: 'MR2',
        title_link: 'https://gitlab.com/merge/2'
      }
    ],
    text: 'Merge requests are overdue:'
  });
});


test('merge requests (normal older than 5 days and no WIP) reminder is sent', async () => {
  var reminder = new SlackGitlabMRReminder(
    Object.assign(mock_options, {
      mr: {
        normal_mr_days_threshold: 5,
        wip_mr_days_threshold: Infinity
      }
    })
  );
  reminder.gitlab.getGroupMergeRequests = jest.fn(() => {
    return new Promise((resolve, reject) => {
      process.nextTick(() => {
        resolve(mock_merge_requests);
      });
    });
  });
  const result = await reminder.remind();
  expect(result).toBe('Reminder sent');
  expect(reminder.webhook.send).toHaveBeenCalledTimes(1);
  expect(reminder.webhook.send.mock.calls[0][0]).toEqual({
    attachments: [
      {
        author_name: 'person',
        color: '#FC6D26',
        text: 'MR1 description',
        title: 'MR1',
        title_link: 'https://gitlab.com/merge/1'
      }
    ],
    text: 'Merge requests are overdue:'
  });
});

test('no merge requests to send', async () => {
  var reminder = new SlackGitlabMRReminder(mock_options);
  reminder.gitlab.getGroupMergeRequests = jest.fn(() => {
    return new Promise((resolve, _) => {
      process.nextTick(() => {
        resolve([]);
      });
    });
  });
  expect(await reminder.remind()).toEqual('No reminders to send');
});

test('duration-based thresholds with normal_mr_threshold and wip_mr_threshold', async () => {
  var reminder = new SlackGitlabMRReminder({
    slack: { webhook_url: 'hook', channel: 'merge-requests' },
    gitlab: { access_token: 'token', group: 'mygroup' },
    mr: {
      normal_mr_threshold: '2h',
      wip_mr_threshold: '5d'
    }
  });
  const mrs = [
    {
      id: 1,
      title: 'Recent normal MR',
      description: 'Updated 1 hour ago',
      author: { name: 'person' },
      web_url: 'https://gitlab.com/merge/1',
      updated_at: moment().subtract(1, 'hours').toDate()
    },
    {
      id: 2,
      title: 'Old normal MR',
      description: 'Updated 3 hours ago',
      author: { name: 'person' },
      web_url: 'https://gitlab.com/merge/2',
      updated_at: moment().subtract(3, 'hours').toDate()
    },
    {
      id: 3,
      title: 'Draft: Recent draft MR',
      description: 'Updated 3 days ago',
      author: { name: 'person' },
      web_url: 'https://gitlab.com/merge/3',
      draft: true,
      updated_at: moment().subtract(3, 'days').toDate()
    },
    {
      id: 4,
      title: 'Draft: Old draft MR',
      description: 'Updated 6 days ago',
      author: { name: 'person' },
      web_url: 'https://gitlab.com/merge/4',
      draft: true,
      updated_at: moment().subtract(6, 'days').toDate()
    }
  ];
  reminder.gitlab.getGroupMergeRequests = jest.fn(() => Promise.resolve(mrs));
  const result = await reminder.remind();
  expect(result).toBe('Reminder sent');
  expect(reminder.webhook.send.mock.calls[0][0]).toEqual({
    attachments: [
      {
        author_name: 'person',
        color: '#FC6D26',
        text: 'Updated 3 hours ago',
        title: 'Old normal MR',
        title_link: 'https://gitlab.com/merge/2'
      },
      {
        author_name: 'person',
        color: '#FC6D26',
        text: 'Updated 6 days ago',
        title: 'Draft: Old draft MR',
        title_link: 'https://gitlab.com/merge/4'
      }
    ],
    text: 'Merge requests are overdue:'
  });
});

test('throws when both normal_mr_threshold and normal_mr_days_threshold are set', () => {
  expect(() => new SlackGitlabMRReminder({
    slack: { webhook_url: 'hook', channel: 'merge-requests' },
    gitlab: { access_token: 'token', group: 'mygroup' },
    mr: {
      normal_mr_threshold: '2h',
      normal_mr_days_threshold: 5
    }
  })).toThrow('Cannot set both normal_mr_threshold and normal_mr_days_threshold');
});

test('throws when both wip_mr_threshold and wip_mr_days_threshold are set', () => {
  expect(() => new SlackGitlabMRReminder({
    slack: { webhook_url: 'hook', channel: 'merge-requests' },
    gitlab: { access_token: 'token', group: 'mygroup' },
    mr: {
      wip_mr_threshold: '2h',
      wip_mr_days_threshold: 7
    }
  })).toThrow('Cannot set both wip_mr_threshold and wip_mr_days_threshold');
});
