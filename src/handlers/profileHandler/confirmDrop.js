'use strict';

const Extra = require('telegraf/extra');
const User = require('../../models/User');

module.exports = () => [
  'drop_stats',
  async ({ i18n, update, editMessageText }) => {
    try {
      await User.findOneAndUpdate(
        { id: update.callback_query.from.id },
        { points: 0, answers: 0, askedQuestions: 0 },
      );

      editMessageText(
        i18n.t(`settings.drop.success`),
        Extra.HTML().markup(m =>
          m.inlineKeyboard([[m.callbackButton(i18n.t('menus.settings.back'), 'router::settings')]]),
        ),
      );
    } catch (err) {
      editMessageText(i18n.t('errors.unknown'), { parse_mode: 'HTML' });
      console.error(
        `[%s] Произошла ошибка при использовании команды start. | UserID: %d`,
        new Date().toTimeString(),
        update.callback_query.from.id,
        err,
      );
    }
  },
];
