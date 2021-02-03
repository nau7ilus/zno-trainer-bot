'use strict';

const { join } = require('path');
const Store = require('../base/Store');
const Middleware = require('../pieces/Middleware');

module.exports = class MiddlewareStore extends Store {
  constructor(client) {
    super(client, ['middlewares', 'middlewares'], Middleware);
  }

  load(directory, file) {
    const fileLocation = join(directory, file);
    let storedPiece = null;
    try {
      const Piece = require(fileLocation);
      storedPiece = new Piece(this, file, directory);
      this.client.use(storedPiece.run);
    } catch (err) {
      console.error(err.message);
    }

    this.set(storedPiece);
    return storedPiece;
  }
};
