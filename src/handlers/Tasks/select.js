'use strict';

const { send, backButton, selectSubject, getThemes, selectTypes } = require('../../helpers');
const Handler = require('../../structures/pieces/Handler');

const chunk = (a, n) => [...Array(Math.ceil(a.length / n))].map((_, i) => a.slice(n * i, n + n * i));

module.exports = class extends Handler {
  constructor(...args) {
    super(...args, {
      name: /^select(?:::(\w+))?(?:::(\w+))?(?:::(\w+))?$/,
      types: ['action'],
    });
  }

  run(ctx) {
    if (ctx.match[1] === 'subject') {
      send(ctx, ctx.i18n.t('select.subjects.message', { secret: ctx.match[0] }), [
        ...selectSubject(ctx),
        backButton(ctx, 'start'),
      ]);
    }

    if (ctx.match[1] === 'types') {
      send(
        ctx,
        ctx.i18n.t('select.types.message', {
          secret: ctx.match[0],
        }),
        [...selectTypes(ctx, ctx.match[2]), backButton(ctx, 'select::subject')],
      );
    }

    if (ctx.match[1] === 'themes') {
      const themes = getThemes(ctx)[ctx.match[2]];
      if (!ctx.match[3]) {
        send(
          ctx,
          ctx.i18n.t('select.themes.message', {
            secret: ctx.match[0],
            themes: Object.keys(themes),
          }),
          [
            ...chunk(
              Object.keys(themes).map((t, i) => ({
                text: `🔸 ${i + 1}`,
                callback_data: `select::themes::${ctx.match[2]}::${i}`,
              })),
              4,
            ),
            backButton(ctx, `select::types::${ctx.match[2]}`),
          ],
        );
      } else {
        const markup = [
          ...chunk(
            Object.values(themes)[ctx.match[3]].map((t, i) => ({
              text: `🔸 ${i + 1}`,
              callback_data: `startGame::${ctx.match[2]}::${ctx.match[3]}::${i}`,
            })),
            5,
          ),
          backButton(ctx, `select::themes::${ctx.match[2]}`),
        ];

        send(
          ctx,
          ctx.i18n.t('select.themes.message', {
            themes: Object.values(themes)[ctx.match[3]],
            secret: ctx.match[0],
          }),
          markup,
        );
      }
    }
  }
};
