'use strict';

const OpenTask = require('../../../helpers/OpenTask');
const Handler = require('../../../structures/pieces/Handler');

module.exports = class extends Handler {
  constructor(...args) {
    super(...args, {
      name: 'sendOpenTask',
      types: ['action'],
    });
  }
  run(ctx, task) {
    const photoURL = `${process.env.CDN_URL}/${task.id}/task.png`;
    const markup = new OpenTask(ctx, task).createMarkup();

    ctx.replyWithPhoto(photoURL, {
      // Caption: ctx.i18n.t(`tasks.${types[task.taskType]}.question`),
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: markup,
      },
    });
  }
};
