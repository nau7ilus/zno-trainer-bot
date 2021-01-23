'use strict';

const { Schema, model } = require('mongoose');

const LogSchema = new Schema(
  {
    userID: { type: Number, required: true },
    actionType: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    details: { type: Array },
  },
  { versionKey: false },
);

module.exports = model('logs', LogSchema);
