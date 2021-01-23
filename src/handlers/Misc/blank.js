'use strict';

const Handler = require('../../structures/pieces/Handler');

module.exports = class extends Handler {
  constructor(...args) {
    super(...args, {
      name: 'blank',
      types: ['action'],
    });
  }

  run(ctx) {
    ctx.answerCbQuery(ctx.i18n.t('errors.nothingThere'));
  }
};
