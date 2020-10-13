'use strict';

const Markup = require('telegraf/markup');
const Table = require('../../helpers/table');
const User = require('../../models/User');

module.exports = () => [
  'check_ans',
  async ctx => {
    try {
      const ctxTable = ctx.update.callback_query.message.reply_markup.inline_keyboard;
      const table = new Table({ keyboardBtns: ctxTable });
      table.rows.splice(-1, 1);

      const points = table.countPoints(ctx.session.task.answers);
      const correctAnswersPercent = (points / ctx.session.task.answers.length) * 100;
      const nextTaskMarkup = Markup.inlineKeyboard([
        [Markup.callbackButton(ctx.i18n.t('tasks.next'), 'create::true')],
        [Markup.callbackButton(ctx.i18n.t('menus.main.back'), 'router::main::true')],
      ]).extra();

      if (correctAnswersPercent >= 100) {
        // Если все правильно, добавим задание в список "Не спрашивать"
        if (!ctx.session.alreadyAsked) ctx.session.alreadyAsked = [];
        ctx.session.alreadyAsked.push(ctx.session.task._id);

        ctx.replyWithHTML(ctx.i18n.t('tasks.table.absolutely', { points }), nextTaskMarkup);
      } else if (correctAnswersPercent >= 75) {
        ctx.replyWithHTML(ctx.i18n.t('tasks.table.great', { points }), nextTaskMarkup);
      } else if (correctAnswersPercent >= 1) {
        ctx.replyWithHTML(ctx.i18n.t('tasks.table.ok', { points }), nextTaskMarkup);
      } else {
        ctx.replyWithHTML(ctx.i18n.t('tasks.table.bad', { points }), nextTaskMarkup);
      }

      table.writeAnswers(ctx.session.task.answers);
      ctx.editMessageReplyMarkup(table.toKeyboard().reply_markup);

      ctx.session.task = null;
      ctx.session.askedAt = null;

      ctx.answerCbQuery();

      // Считаем статистику пользователя
      const userID = ctx.update.callback_query.from.id || null;
      const user = await User.findOne({ id: userID });
      if (!user) {
        User.create({
          id: userID,
          points,
          answers: correctAnswersPercent / 100,
          askedQuestions: 1,
        });
      }

      // Изменяем данные пользователя в базе данных
      user.points += points;
      user.answers += correctAnswersPercent / 100;
      user.askedQuestions += 1;
      user.save();
    } catch (err) {
      console.error(err);
      ctx.answerCbQuery(ctx.i18n.t(err.message));
    }
  },
];
