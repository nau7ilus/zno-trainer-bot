'use strict';

module.exports = class OpenTask {
  constructor(ctx, task = {}, markup = {}) {
    this.ctx = ctx;
    this.message = ctx.update.callback_query.message;

    this.task = task;
    this.markup = markup?.reply_markup?.inline_keyboard ?? markup;
  }

  get givenAnswers() {
    return this.markup[0].map(i => (isNaN(+i.text) ? null : +i.text));
  }

  get keyboard() {
    return {
      reply_markup: {
        inline_keyboard: this.markup,
      },
    };
  }

  get taskAnswers() {
    return this.task.taskType === 2 ? [this.task.answer] : this.task.answer;
  }

  createMarkup() {
    this.markup = [
      new Array(this.taskAnswers.length)
        .fill(this.ctx.i18n.t('tasks.open.noAnswer'))
        .map((text, i) => ({ text, callback_data: `selectAnswer::${i}::${this.task.id}` })),

      [
        { text: this.ctx.i18n.t('tasks.skip.title'), callback_data: 'skip' },
        { text: this.ctx.i18n.t('tasks.open.checkAnswers'), callback_data: `checkOpenTask::${this.task.id}` },
      ],
    ];

    return this.markup;
  }

  selectAnswer(index) {
    this.ctx.session.currentAnswer = index;
    this.ctx.session.pastValue = !isNaN(+this.markup[0][index].text) ? this.markup[0][index].text : null;

    this.markup[0][+index].text = this.ctx.i18n.t('tasks.open.selectedAnswer');
    this.markup[0][+index].callback_data = `unselectAnswer::${index}::${this.task.id}`;

    return this;
  }

  unselectAnswer(index) {
    this.ctx.session.currentAnswer = undefined;
    this.ctx.session.pastValue = undefined;

    this.markup[0][+index].text = this.ctx.session.pastValue ?? this.ctx.i18n.t('tasks.open.noAnswer');
    this.markup[0][+index].callback_data = `selectAnswer::${index}::${this.task.id}`;

    return this;
  }

  validMessage(text) {
    const args = text.split(/ +/g);
    if (args.length > this.taskAnswers.length) return 'errors.tasks.open.tooManyArguments';

    const invalidArgs = args.filter(arg => isNaN(+arg));
    if (invalidArgs.length > 0) return 'errors.tasks.open.invalidArgument';

    return true;
  }

  setAnswer(index, value) {
    this.markup[0][index].text = value;
    this.markup[0][index].callback_data = `selectAnswer::${index}::${this.task.id}`;

    this.ctx.session.currentAnswer = undefined;
    this.ctx.session.pastValue = undefined;

    return this;
  }

  parseAnswers() {
    const givenAnswers = this.markup[0].map(i => +i.text);

    if (givenAnswers.filter(i => isNaN(i)).length > 0) {
      throw new Error('errors.tasks.open.noAnswers');
    }

    const correctAnswers = [];
    givenAnswers.forEach(ans => {
      if (this.taskAnswers.includes(+ans)) correctAnswers.push(+ans);
    });

    return correctAnswers;
  }

  deactivateButtons() {
    this.markup.pop();
    this.markup[0].forEach(i => (i.callback_data = 'blank'));
  }

  toJSON() {
    return {
      match: this.ctx.match,
      message: this.message,
      task: this.task,
    };
  }
};
