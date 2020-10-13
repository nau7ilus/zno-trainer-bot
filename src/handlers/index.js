'use strict';

module.exports = {
  startCommand: require('./start'),
  router: require('./router'),

  profileCommand: require('./profileHandler/profileCommand'),
  dropStats: require('./profileHandler/dropStats'),
  confirmDrop: require('./profileHandler/confirmDrop'),
  ratingCommand: require('./ratingHandler/command'),
  incognitoAction: require('./ratingHandler/incognito'),

  createTask: require('./createTask'),
  skipTask: require('./skipTask'),
  simpleTaskHandler: require('./simpleHandler'),
  checkTableAnswers: require('./tablesHandler/checkAnswers'),
  selectTableCell: require('./tablesHandler/selectCell'),

  languageCommand: require('./selectLanguage/command'),
  languageAction: require('./selectLanguage/action'),
};
