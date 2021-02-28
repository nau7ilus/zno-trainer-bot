'use strict';

const { formatInt, send, backButton } = require('../../helpers');
const Handler = require('../../structures/pieces/Handler');

// eslint-disable-next-line consistent-return
const formatUser = async (ctx, user, subject, i, fetchNick = true) => {
  try {
    const userStats = user.stats[subject];
    const { points, correctAnswers, totalAsked } = userStats;

    const userSettings = user.settings;
    const { incognito } = userSettings;

    const chatInfo = fetchNick ? await ctx.telegram.getChat(user.id) : null;
    const userName = !chatInfo || incognito ? ctx.i18n.t('rating.incognito') : chatInfo.first_name;

    const formattedPoints = formatInt(points);
    const correctAnswersPercent = ((correctAnswers / totalAsked) * 100).toFixed(1);

    return `<b>${i <= 2 ? ['🥇', '🥈', '🥉'][i] : `${i + 1}.`} ${userName} — ${
      isNaN(formattedPoints) ? 0 : formattedPoints
    } | ${isNaN(correctAnswersPercent) ? 0 : correctAnswersPercent}%</b>`;
  } catch (err) {
    if (err.message.includes('chat not found')) {
      return formatUser(ctx, user, subject, i, false);
    } else {
      console.error(err);
    }
  }
};

module.exports = class extends Handler {
  constructor(...args) {
    super(...args, {
      name: /^rating::(\w+)(?:::(\w+))?$/,
      types: ['action'],
    });
  }
  // eslint-disable-next-line consistent-return
  async run(ctx) {
    const subject = ctx.match[1];
    const page = +ctx.match[2];

    if (page > Math.floor(ctx.users.length / 10)) return ctx.answerCbQuery(ctx.i18n.t('rating.pageError'));

    const rating = [];
    const userInfo = [];

    const users = ctx.users
      .sort((a, b) => {
        const aPoints = a.stats[subject].points;
        const bPoints = b.stats[subject].points;
        const aCorAns = a.stats[subject].correctAnswers;
        const bCorAns = b.stats[subject].correctAnswers;

        if (aPoints === bPoints) {
          return aCorAns < bCorAns ? 1 : aCorAns > bCorAns ? -1 : 0;
        } else {
          return aPoints < bPoints ? 1 : -1;
        }
      })
      .slice(10 * page, 10 * page + 10);

    for await (const [i, user] of users.entries()) {
      const formattedData = await formatUser(ctx, user, subject, i + page * 10);
      rating.push(formattedData);
      if (user.id === ctx.from.id) userInfo.push(formattedData);
    }

    if (userInfo.length === 0) {
      const index = ctx.users.findIndex(u => u.id === ctx.user.id);
      userInfo.push(await formatUser(ctx, ctx.user, subject, index));
    }

    send(
      ctx,
      ctx.i18n.t('rating.markup', { rating, userInfo, subjectName: ctx.i18n.t(`rating.subjects.${subject}`) }),
      [
        [
          { text: page === 0 ? '•' : '«', callback_data: `rating::${subject}::${page === 0 ? 999 : page - 1}` },
          { text: page + 1, callback_data: 'blank' },
          {
            text: page === Math.floor(ctx.users.length / 10) ? '•' : '»',
            callback_data: `rating::${subject}::${page + 1}`,
          },
        ],
        backButton(ctx, 'rating'),
      ],
    );
  }
};
