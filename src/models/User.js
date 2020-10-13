'use strict';

const Double = require('@mongoosejs/double');
const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    answers: { type: Double, default: 0 },
    askedQuestions: { type: Double, default: 0 },
    points: { type: Number, default: 0 },
    joinDate: { type: Date, default: Date.now },
    incognito: { type: Boolean, default: false },
  },
  {
    versionKey: false,
  },
);

module.exports = model('user', UserSchema);
