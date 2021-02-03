'use strict';

const { send, backButton } = require('../../helpers');
const Handler = require('../../structures/pieces/Handler');

module.exports = class extends Handler {
  constructor(...args) {
    super(...args, {
      name: /^getExplanation(?:::(\w+))$/,
      types: ['action'],
    });
  }
  run(ctx) {
    return send(ctx, ctx.i18n.t('', { CDN_URL: process.env.CDN_URL, taskID: ctx.match[1] }), [
      backButton(ctx, 'start'),
    ]);
  }
};
