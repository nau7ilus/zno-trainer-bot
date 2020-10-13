'use strict';

const Markup = require('telegraf/markup');
const { alphabet } = require('../../helpers');
const User = require('../../models/User');

module.exports = () => [
  /^simple(?:::(\w+))?(?:::(\w+))?$/,
  async ctx => {
    try {
      ctx.answerCbQuery();

      // Проверяем наличие задания
      if (!ctx.session.task) throw new Error('Нет активного задания');

      // Находим пользователя в базе данных
      const user = await User.findOne({ id: ctx.update.callback_query.from.id });
      if (!user) throw new Error('Пользователь не найден');

      // Создаем клавиатуру для навигации к следующему заданию
      const nextTaskMarkup = Markup.inlineKeyboard([
        [Markup.callbackButton(ctx.i18n.t('tasks.next'), 'create::true')],
        [Markup.callbackButton(ctx.i18n.t('menus.main.back'), 'router::main::true')],
      ]).extra();

      // Проверяем, явялется ли выбранная кнопка верным ответом
      if (+ctx.match[1] === ctx.session.task.answers) {
        // Добавляем балл пользователю
        user.points += 1;
        user.answers += 1;
        user.askedQuestions += 1;

        // Не спрашивать это задание в будущем
        if (!ctx.session.alreadyAsked) ctx.session.alreadyAsked = [];
        ctx.session.alreadyAsked.push(ctx.session.task._id);

        // Отправляем сообщение о том, что ответ верный
        ctx.replyWithHTML(
          ctx.i18n.t('tasks.simple.right', { answer: alphabet[+ctx.match[1]] }),
          nextTaskMarkup,
        );
      } else {
        // Фиксируем это задание в базе данных
        user.askedQuestions += 1;

        // Отправляем сообщение о том, что ответ неверный
        ctx.replyWithHTML(
          ctx.i18n.t('tasks.simple.wrong', { rightAnswer: alphabet[ctx.session.task.answers] }),
          nextTaskMarkup,
        );
      }

      // Сохраняем измененные данные пользователя
      user.save();

      // Убираем активное задание из сессии
      ctx.session.task = null;
      ctx.session.askedAt = null;

      // Убираем клавиатуру
      ctx.editMessageReplyMarkup();
    } catch (err) {
      // Пропускаем ошибки
      ctx.answerCbQuery();
    }
  },
];
