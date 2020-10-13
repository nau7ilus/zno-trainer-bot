'use strict';

const Extra = require('telegraf/extra');

module.exports = () => ({ i18n, replyWithHTML }) => {
  replyWithHTML(
    i18n.t('settings.drop.warning'),
    Extra.HTML().markup(m =>
      m.inlineKeyboard([
        [
          {
            text: i18n.t('menus.settings.dropStats.agreeWarning'),
            callback_data: 'drop_stats',
          },
        ],
        [{ text: i18n.t('menus.settings.back'), callback_data: 'router::settings' }],
      ]),
    ),
  );
};
