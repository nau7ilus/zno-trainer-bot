'use strict';

const { clearCache } = require('cachegoose');
const { send, backButton } = require('../../../helpers');
const User = require('../../../models/User');
const Handler = require('../../../structures/pieces/Handler');

const dropStatsQuery = {
  'stats.algebra.totalAsked': 0,
  'stats.algebra.correctAnswers': 0,
  'stats.algebra.points': 0,
  'stats.geometry.totalAsked': 0,
  'stats.geometry.correctAnswers': 0,
  'stats.geometry.points': 0,
  'stats.total.totalAsked': 0,
  'stats.total.correctAnswers': 0,
  'stats.total.points': 0,
};

module.exports = class extends Handler {
  constructor(...args) {
    super(...args, {
      name: /^dropstats(?:::(\w+))$/,
      types: ['action'],
    });
  }
  async run(ctx) {
    clearCache(null, { id: ctx.from.id });
    await User.findOneAndUpdate({ id: ctx.from.id }, dropStatsQuery);

    send(ctx, ctx.i18n.t(`settings.drop.success`), [backButton(ctx, 'settings')]);
  }
};
