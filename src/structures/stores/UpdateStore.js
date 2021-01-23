'use strict';

const { join } = require('path');
const Store = require('../base/Store');
const Update = require('../pieces/Update');

module.exports = class UpdateStore extends Store {
  constructor(client) {
    super(client, ['updates', 'событий'], Update);
  }

  load(directory, file) {
    const fileLocation = join(directory, file);
    let storedPiece = null;
    try {
      const Piece = require(fileLocation);
      storedPiece = new Piece(this, file, directory);
      if (!storedPiece.type) throw new Error('Не указан тип события');
      this.client.on(storedPiece.type, storedPiece.run.bind());
    } catch (err) {
      console.error(err);
    }

    this.set(storedPiece);
    return storedPiece;
  }
};
