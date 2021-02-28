'use strict';

const { backButton, send, formatInt } = require('../../helpers');
const Handler = require('../../structures/pieces/Handler');

module.exports = class extends Handler {
  constructor(...args) {
    super(...args, {
      name: 'profile',
      types: ['command', 'action'],
    });
  }

  run(ctx) {
    const s = ctx.user.stats;
    const data = {
      algebra: {
        correctAnswersRatio: ((s.algebra.correctAnswers / s.algebra.totalAsked) * 100).toFixed(1),
        points: formatInt(s.algebra.points),
        totalAsked: formatInt(s.algebra.totalAsked),
        correctAnswers: formatInt(Math.round(s.algebra.correctAnswers)),
      },
      geometry: {
        correctAnswersRatio: ((s.geometry.correctAnswers / s.geometry.totalAsked) * 100).toFixed(1),
        points: formatInt(s.geometry.points),
        totalAsked: formatInt(s.geometry.totalAsked),
        correctAnswers: formatInt(Math.round(s.geometry.correctAnswers)),
      },
      total: {
        correctAnswersRatio: ((s.total.correctAnswers / s.total.totalAsked) * 100).toFixed(1),
        points: formatInt(s.total.points),
        totalAsked: formatInt(s.total.totalAsked),
        correctAnswers: formatInt(Math.round(s.total.correctAnswers)),
      },
    };

    send(ctx, ctx.i18n.t('profile.stats', { data, user: ctx.user }), [backButton(ctx, 'start')]);
  }
};
