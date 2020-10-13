/* eslint-disable capitalized-comments */
/* eslint-disable consistent-return */
'use strict';

const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');

const Table = require('../../helpers/table');
const Task = require('../../models/Task');

module.exports = () => [
  /^create(?:::(\w+))$/,
  async ctx => {
    try {
      ctx.answerCbQuery();

      // Если уже дано задание, не отправляем новое
      if (ctx.session.task) {
        const markup = [[Markup.callbackButton(ctx.i18n.t('menus.main.back'), 'router::main')]];
        markup.unshift([
          Markup.callbackButton(ctx.i18n.t('menus.settings.skipTask'), 'router::skip'),
        ]);
        return ctx.editMessageText(
          ctx.i18n.t('errors.activeTask'),
          Extra.HTML().markup(m => m.inlineKeyboard(markup)),
        );
      }

      // Если необходимо, удаляем кнопки с предыдущего сообщения
      if (ctx.match[1] === 'true') {
        ctx.editMessageReplyMarkup();
      }

      // Поиск рандомного задания
      const query = Task.where('_id').nin(ctx.session.alreadyAsked ? ctx.session.alreadyAsked : []);
      const docsCount = await query.countDocuments();
      const randomTask = await query.findOne().skip(Math.floor(Math.random() * docsCount));
      if (!randomTask) {
        return ctx.replyWithHTML(ctx.i18n.t('errors.createTask'));
      }

      ctx.session.task = randomTask;
      ctx.session.askedAt = Date.now();

      if (randomTask.type === 'table') {
        const table = new Table({
          columns: 5,
          rows: randomTask.answers.length,
        });
        table.rows.push([Markup.callbackButton('📚 Проверить ответы', 'check_ans')]);
        ctx.replyWithPhoto(randomTask.photoURL, table.toKeyboard());
      } else if (randomTask.type === 'simple') {
        ctx.replyWithPhoto(
          randomTask.photoURL,
          Extra.markup(m =>
            m.inlineKeyboard([
              [
                m.callbackButton('🔸 А', 'simple::0'),
                m.callbackButton('🔸 Б', 'simple::1'),
                m.callbackButton('🔸 В', 'simple::2'),
                m.callbackButton('🔸 Г', 'simple::3'),
                m.callbackButton('🔸 Д', 'simple::4'),
              ],
              [m.callbackButton(ctx.i18n.t('tasks.skip.title'), 'router::skip::true')],
            ]),
          ),
        );
      } else {
        ctx.replyWithHTML(ctx.i18n.t('errors.createTask'));
      }
    } catch (err) {
      console.error(`[%s] Произошла ошибка при отправке задания.`, new Date().toTimeString(), err);
    }
  },
];
