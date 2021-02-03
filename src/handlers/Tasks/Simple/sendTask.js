'use strict';

const { alphabet } = require('../../../helpers');
const Handler = require('../../../structures/pieces/Handler');

module.exports = class extends Handler {
  constructor(...args) {
    super(...args, {
      name: 'sendSimpleTask',
      types: ['action'],
    });
  }
  run(ctx, task) {
    const photoURL = `${process.env.CDN_URL}/${task.id}/task.png`;
    ctx.replyWithPhoto(photoURL, {
      caption: ctx.i18n.t('tasks.simple.question'),
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          new Array(4).fill('').map((i, j) => ({
            text: `🔸 ${alphabet[j]}`,
            callback_data: `checkSimple::${j}`,
          })),
          [{ text: ctx.i18n.t('tasks.skip.title'), callback_data: 'skip' }],
        ],
      },
    });
  }
};
