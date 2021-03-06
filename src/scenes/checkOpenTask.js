'use strict';

const TelegrafScene = require('telegraf/scenes/base');
const OpenTask = require('../helpers/OpenTask');
const Scene = require('../structures/pieces/Scene');

module.exports = class extends Scene {
  constructor(...args) {
    super(...args, {
      name: 'checkOpenTask',
    });
  }
  run() {
    const editMessageMarkup = (ctx, newMarkup) => {
      const { message } = ctx.session.openTaskData;
      ctx.telegram.editMessageReplyMarkup(message.chat.id, message.message_id, null, newMarkup);
    };

    const scene = new TelegrafScene('checkOpenTask');
    scene.enter(ctx => {
      ctx.replyWithHTML(
        ctx.i18n.t('tasks.open.listenAnswer.enter', {
          index: ctx.session.currentAnswer,
          pastValue: ctx.session.pastValue,
        }),
      );

      const { message, task } = ctx.session.openTaskData;
      const openTask = new OpenTask(ctx, task, message);

      ctx.scene.session.openTask = openTask;
      ctx.scene.session.sceneWillDie = Date.now() + 30 * 1000;
      setTimeout(() => ctx.scene.leave(), 30 * 1000);
    });

    scene.leave(ctx => {
      if (ctx.scene.session.timeLeft) {
        ctx.scene.session.openTask.unselectAnswer(ctx.session.openTaskData.match[1]);
        editMessageMarkup(ctx, ctx.session.openTask.keyboard.reply_markup);
        ctx.replyWithHTML(ctx.i18n.t('errors.tasks.open.timeLeft'));
      }
    });

    scene.on('text', ctx => {
      if (ctx.scene.session.sceneWillDie < Date.now()) return ctx.scene.leave();

      if (!ctx.message) {
        ctx.scene.session.openTask.unselectAnswer(ctx.session.openTaskData.match[1]);
        editMessageMarkup(ctx, ctx.scene.session.openTask.keyboard.reply_markup);
        return ctx.replyWithHTML(ctx.i18n.t('errors.tasks.open.timeLeft'));
      }

      const givenAnswer = ctx.message.text;
      const validAnswer = ctx.scene.session.openTask.validMessage(givenAnswer);
      if (typeof validAnswer === 'string') {
        ctx.scene.session.openTask.unselectAnswer(ctx.session.openTaskData.match[1]);
        editMessageMarkup(ctx, ctx.scene.session.openTask.keyboard.reply_markup);
        return ctx.replyWithHTML(ctx.i18n.t(validAnswer));
      }

      ctx.scene.session.openTask.setAnswer(ctx.session.currentAnswer, givenAnswer);
      editMessageMarkup(ctx, ctx.scene.session.openTask.keyboard.reply_markup);
      return ctx.scene.leave();
    });

    scene.on('message', ctx => {
      ctx.scene.session.timeLeft = true;
      ctx.scene.leave();
    });

    return scene;
  }
};
