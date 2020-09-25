const mainMenu = [
  [{ text: "Мои тесты", callback_data: "blank" }],
  [{ text: "Мои ответы", callback_data: "blank" }],
  [{ text: "Тестовая таблица", callback_data: "create_table" }],
];

const alphabet = {
  ua: [
    "А",
    "Б",
    "В",
    "Г",
    "Д",
    "Е",
    "Є",
    "Ж",
    "З",
    "И",
    "І",
    "Ї",
    "Й",
    "К",
    "Л",
    "М",
    "Н",
    "О",
    "П",
    "Р",
    "С",
    "Т",
    "У",
    "Ф",
    "Х",
    "Ц",
    "Ч",
    "Ш",
    "Щ",
    "Ь",
    "Ю",
    "Я",
  ],
};

module.exports = {
  alphabet,
  mainMenu,
};
