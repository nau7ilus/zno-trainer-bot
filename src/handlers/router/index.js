'use strict';

const Extra = require('telegraf/extra');
const { mainMenu, settingsMenu, languagesMenu } = require('../../helpers');
const { getUserStats, skipTask, checkIncognito } = require('../../helpers');
const ratingMarkup = require('../../helpers/ratingMarkup');

module.exports = () => [
  /^router(?:::(\w+))?(?:::(\w+))?$/,
  async ctx => {
    try {
      await ctx.answerCbQuery();

      let tempVar = null;

      switch (ctx.match[1]) {
        case 'settings':
          ctx.editMessageText(ctx.i18n.t('settings.menu'), {
            reply_markup: { inline_keyboard: settingsMenu(ctx.i18n) },
            parse_mode: 'HTML',
          });
          break;

        case 'languages':
          ctx.editMessageText(
            ctx.i18n.t('languages.menu'),
            Extra.HTML().markup(m =>
              m.inlineKeyboard([
                ...languagesMenu,
                [{ text: ctx.i18n.t('menus.settings.back'), callback_data: 'router::settings' }],
              ]),
            ),
          );
          break;

        case 'drop':
          ctx.editMessageText(
            ctx.i18n.t('settings.drop.warning'),
            Extra.HTML().markup(m =>
              m.inlineKeyboard([
                [
                  {
                    text: ctx.i18n.t('menus.settings.dropStats.agreeWarning'),
                    callback_data: 'drop_stats',
                  },
                ],
                [{ text: ctx.i18n.t('menus.settings.back'), callback_data: 'router::settings' }],
              ]),
            ),
          );
          break;

        case 'profile':
          ctx.editMessageText(
            ctx.i18n.t('profile.stats', await getUserStats(ctx.update.callback_query.from.id)),
            Extra.HTML().markup(m =>
              m.inlineKeyboard([
                [{ text: ctx.i18n.t('menus.main.back'), callback_data: 'router::main' }],
              ]),
            ),
          );
          break;

        case 'incognito':
          // Включен ли режим инкогнито?
          tempVar = await checkIncognito(ctx.update.callback_query.from.id);
          ctx.editMessageText(
            ctx.i18n.t(`settings.incognito.${tempVar ? 'on' : 'off'}`),
            Extra.HTML().markup(m =>
              m.inlineKeyboard([
                [
                  m.callbackButton(
                    ctx.i18n.t(`menus.settings.incognito.${tempVar ? 'off' : 'on'}`),
                    `incognito::${!tempVar}`,
                  ),
                ],
                [m.callbackButton(ctx.i18n.t('menus.settings.back'), 'router::settings')],
              ]),
            ),
          );
          break;

        case 'rating':
          ctx.editMessageText(
            ctx.i18n.t('rating.markup', await ratingMarkup(ctx, ctx.update.callback_query.from.id)),
            Extra.HTML().markup(m =>
              m.inlineKeyboard([
                [{ text: ctx.i18n.t('menus.main.back'), callback_data: 'router::main' }],
              ]),
            ),
          );
          break;

        case 'skip':
          if (ctx.match[2] === 'true') {
            ctx.replyWithHTML(
              ctx.i18n.t(await skipTask(ctx.update.callback_query.from.id, ctx.session)),
              Extra.HTML().markup(m =>
                m.inlineKeyboard([
                  [{ text: ctx.i18n.t('tasks.next'), callback_data: 'create::true' }],
                  [{ text: ctx.i18n.t('menus.main.back'), callback_data: 'router::main::true' }],
                ]),
              ),
            );
            ctx.editMessageReplyMarkup();
          } else {
            ctx.editMessageText(
              ctx.i18n.t(await skipTask(ctx.update.callback_query.from.id, ctx.session)),
              Extra.HTML().markup(m =>
                m.inlineKeyboard([
                  [{ text: ctx.i18n.t('menus.main.back'), callback_data: 'router::main' }],
                ]),
              ),
            );
          }
          break;

        case 'main':
          if (ctx.match[2] === 'true') {
            ctx.replyWithHTML(ctx.i18n.t('greeting.other'), {
              reply_markup: { inline_keyboard: mainMenu(ctx.i18n) },
            });
            ctx.editMessageReplyMarkup();
          } else {
            ctx.editMessageText(ctx.i18n.t('greeting.other'), {
              reply_markup: { inline_keyboard: mainMenu(ctx.i18n) },
              parse_mode: 'HTML',
            });
          }
          break;

        default:
          ctx.editMessageText(ctx.i18n.t('errors.unknown'), { parse_mode: 'HTML' });
      }
    } catch (err) {
      console.error(
        `[%s] Произошла ошибка при использовании команды start. | UserID: %d`,
        new Date().toTimeString(),
        ctx.update.callback_query.from.id,
        err,
      );
      ctx.editMessageText(ctx.i18n.t('errors.unknown'), { parse_mode: 'HTML' });
    }
  },
];
