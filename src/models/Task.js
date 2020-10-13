'use strict';

const { Schema, model } = require('mongoose');

const TaskSchema = new Schema(
  {
    type: { type: String, required: true },
    photoURL: { type: String, required: true },
    answers: { type: Schema.Types.Mixed, required: true },
    ids: {
      test: Number,
      task: Number,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = model('task', TaskSchema);
