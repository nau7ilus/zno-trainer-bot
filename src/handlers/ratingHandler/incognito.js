'use strict';

const Extra = require('telegraf/extra');
const User = require('../../models/User');

module.exports = () => [
  /^incognito(?:::(\w+))?$/,
  async ({ i18n, match, update, editMessageText }) => {
    try {
      const changeTo = match[1] === 'true';
      await User.findOneAndUpdate({ id: update.callback_query.from.id }, { incognito: changeTo });

      editMessageText(
        i18n.t(`settings.incognito.${changeTo ? 'on' : 'off'}`),
        Extra.HTML().markup(m =>
          m.inlineKeyboard([
            [
              m.callbackButton(
                i18n.t(`menus.settings.incognito.${changeTo ? 'off' : 'on'}`),
                `incognito::${!changeTo}`,
              ),
            ],
            [m.callbackButton(i18n.t('menus.settings.back'), 'router::settings')],
          ]),
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
