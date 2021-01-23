'use strict';

const Piece = require('../base/Piece');

module.exports = class Handler extends Piece {
  constructor(store, file, directory, options = {}) {
    super(store, file, directory, options);
    this.name = options.name;
    this.description = options.description;
    this.category = options.category || file.split('/')[0];
    this.adminOnly = options.adminOnly;
    this.types = options.types;
  }

  run() {
    throw new Error(`Функция на запуск команды ${this.name}не указана`);
  }
};
