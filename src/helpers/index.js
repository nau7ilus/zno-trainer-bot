const mainMenu = [
  [{ text: "Мои тесты", callback_data: "blank" }],
  [{ text: "Мои ответы", callback_data: "blank" }],
  [{ text: "Тестовая таблица", callback_data: "create_table" }],
];

const alphabet = ["А", "Б", "В", "Г", "Д", "Е", "Є", "Ж", "З"];

module.exports = {
  alphabet,
  mainMenu,
};
