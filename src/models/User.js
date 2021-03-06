'use strict';

const Double = require('@mongoosejs/double');
const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    isLanguageSet: { type: Boolean, default: false },
    isFirstRun: { type: Boolean, default: true },
    stats: {
      algebra: {
        totalAsked: { type: Number, default: 0 },
        correctAnswers: { type: Double, default: 0 },
        points: { type: Number, default: 0 },
      },
      geometry: {
        totalAsked: { type: Number, default: 0 },
        correctAnswers: { type: Double, default: 0 },
        points: { type: Number, default: 0 },
      },
      total: {
        totalAsked: { type: Number, default: 0 },
        correctAnswers: { type: Double, default: 0 },
        points: { type: Number, default: 0 },
      },
    },
    settings: {
      incognito: { type: Boolean, default: false },
    },
  },
  {
    versionKey: false,
  },
);

UserSchema.statics.findOneOrCreate = async function findOneOrCreate(condition, doc) {
  return (await this.findOne(condition)) || this.create(doc);
};

module.exports = model('new-users', UserSchema);
