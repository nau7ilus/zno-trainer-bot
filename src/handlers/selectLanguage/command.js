'use strict';

const Extra = require('telegraf/extra');
const { languagesMenu } = require('../../helpers');

module.exports = () => ({ i18n, replyWithHTML }) => {
  replyWithHTML(
    i18n.t('languages.menu'),
    Extra.HTML().markup(m =>
      m.inlineKeyboard([
        ...languagesMenu,
        [{ text: i18n.t('menus.settings.back'), callback_data: 'router::settings' }],
      ]),
    ),
  );
};
