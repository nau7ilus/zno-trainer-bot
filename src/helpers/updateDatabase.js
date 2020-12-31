'use strict';

const fs = require('fs');
const { stringify } = require('querystring');
const axios = require('axios');
const cheerio = require('cheerio');

const URL = 'https://zno.osvita.ua';
const PATH = './tasks';
const TASK_TYPES = {
  'Завдання з вибором однієї правильної відповіді': 0,
  'Завдання на встановлення відповідності (логічні пари)': 1,
  'Завдання відкритої форми з короткою відповіддю (1 вид)': 2,
  'Завдання відкритої форми з короткою відповіддю, структуроване': 3,
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const replaceNames = markup =>
  markup
    .replace(new RegExp('<label><span class="marker"></span></label>', 'gi'), '0')
    .replace(new RegExp('<label><span class="marker ok"></span></label>', 'gi'), '1');

const urls = {
  algebra: [
    'https://zno.osvita.ua/mathematics/tag-dijsni_chysla/',
    'https://zno.osvita.ua/mathematics/tag-vidnoshennya_ta_proporciyi/',
    'https://zno.osvita.ua/mathematics/tag-pokaznykovi_logharyfmichni_vyrazy/',
    'https://zno.osvita.ua/mathematics/tag-racionalni_irracionalni_stepenevi_virazi/',
    // eslint-disable-next-line max-len
    'https://zno.osvita.ua/mathematics/tag-linijni_kvadratni_racionalni_rivnjannja_ta_systemy_rivnjan/',
    // eslint-disable-next-line max-len
    'https://zno.osvita.ua/mathematics/tag-irracionalni_tryghonometrychni_rivnjannja_ta_systemy_rivnjan/',
    // eslint-disable-next-line max-len
    'https://zno.osvita.ua/mathematics/tag-pokaznykovi_logharyfmichni_rivnjannja_ta_systemy_rivnjan/',
    'https://zno.osvita.ua/mathematics/tag-nerivnosti_ta_systemy_nerivnostej/',
    'https://zno.osvita.ua/mathematics/tag-rozvjazuvannja_zadach_z_rivnjan_i_system_rivnjan/',
    'https://zno.osvita.ua/mathematics/tag-chislovi_poslidovnosti/',
    'https://zno.osvita.ua/mathematics/tag-funkcionalna_zalezhnist_vlastivosti/',
    'https://zno.osvita.ua/mathematics/tag-linijni_ta_kvadratni_funkciyi/',
    'https://zno.osvita.ua/mathematics/tag-pokaznykovi_logharyfmichni_tryghonometrychni_funkciyi/',
    'https://zno.osvita.ua/mathematics/tag-pokhidna_funkciyi/',
    'https://zno.osvita.ua/mathematics/tag-pervisna_ta_viznachenij_integral/',
    'https://zno.osvita.ua/mathematics/tag-kombinatorni_pravila/',
    'https://zno.osvita.ua/mathematics/tag-jmovirnist_vypadkovoyi_podiyi/',
  ],
  geometry: [
    'https://zno.osvita.ua/mathematics/tag-elementarni_geometrichni_figuri/',
    'https://zno.osvita.ua/mathematics/tag-trikutniki/',
    'https://zno.osvita.ua/mathematics/tag-prjamokutni_trykutnyky/',
    'https://zno.osvita.ua/mathematics/tag-chotirikutniki/',
    'https://zno.osvita.ua/mathematics/tag-prjamokutnyk_kvadrat/',
    'https://zno.osvita.ua/mathematics/tag-kolo_ta_krugh_mnoghokutnyky/',
    'https://zno.osvita.ua/mathematics/tag-koordinati_ta_vektori/',
    'https://zno.osvita.ua/mathematics/tag-pryami_ta_ploshini_u_prostori/',
    'https://zno.osvita.ua/mathematics/tag-mnogogranniki/',
    'https://zno.osvita.ua/mathematics/tag-507/',
    'https://zno.osvita.ua/mathematics/tag-tila_obertannja/',
    'https://zno.osvita.ua/mathematics/tag-koordinati_ta_vektori_u_prostori/',
  ],
};

const downloadImage = async (taskID, fileName, imageURL) => {
  try {
    if (fs.existsSync(`${PATH}/${taskID}/${fileName}`)) return;
    const answer = await axios.get(`${URL}${imageURL}`, { responseType: 'arraybuffer' });
    if (!answer || !answer.data) throw new Error('Неудача при скачивании изображения');

    if (!fs.existsSync(PATH)) fs.mkdirSync(PATH);
    if (!fs.existsSync(`${PATH}/${taskID}`)) fs.mkdirSync(`${PATH}/${taskID}`);

    fs.writeFileSync(`${PATH}/${taskID}/${fileName}`, answer.data);
  } catch (err) {
    console.error('Скачивание фоток', err);
  }
};

const parseTasks = async (url, subject) => {
  try {
    // First things first, get explanation with task ID, then get answers
    const answer = await axios.get(url);
    if (!answer || !answer.data) throw new Error('Неудача при парсе задания');

    // Array, where we will store task's data
    const data = JSON.parse(fs.readFileSync(`${PATH}/config.json`, 'utf-8'));

    // Find all tasks on page by class
    const $ = cheerio.load(answer.data.replace(/\t/g, '').replace(/\n/g, ''));
    const tasks = $('.task-card');

    // Get tag title
    const tag = $('.test-title').find('span.row')[2].children[0].data;
    const tagID = answer.data.split('var tag_id = ')[1].split(';')[0];

    const ids = [];

    tasks.each((i, _task) => {
      const task = $(_task);

      // Get ID, task image and explanation
      const id = +task[0].attribs.class.split('card_')[1];
      const taskImage = task.find('.question img')[0].attribs.src;

      ids.push(id);

      const explanation = task.find(`.explanation img`)[0]
        ? task.find(`.explanation img`)[0].attribs.src
        : null;

      // Download images to local store
      if (taskImage) downloadImage(id, 'task.png', taskImage);
      if (explanation) downloadImage(id, 'explanation.png', explanation);

      // If we already have task ID in config, don't add it
      if (!data.some(j => j.id === id)) {
        data.push({ id, taskImage, explanation, subject, tag });
      }
    });

    // Update config
    fs.writeFileSync(`${PATH}/config.json`, JSON.stringify(data, null, 2));

    await sleep(1000);

    // Next step: parse answers for tasks
    parseAnswers(tagID, ids);
  } catch (err) {
    console.error('Парсинг заданий', err);
  }
};

const answersForOpen = taskMarkup => +taskMarkup.find('.q-info strong')[1].children[0].data;

const answersForSimple = taskMarkup =>
  taskMarkup
    .find('table.select-answers-variants')
    .find('tr')[1]
    .children.filter(c => c.name === 'td')
    .map(j => (j.children[0] ? j.children[0].data : ''))
    .indexOf('1');

const answersForStructurized = taskMarkup => {
  const answers = [];
  taskMarkup
    .find('table.answer strong')
    .slice(2)
    .each((i, el) => answers.push(+el.children[0].data));
  return answers;
};

const answersForTable = taskMarkup => {
  const answers = [];
  taskMarkup
    .find('table.select-answers-variants')
    .find('tr')
    .each((i, el) => {
      if (i === 0) return;
      answers.push(
        el.children
          .filter(j => j.name === 'td')
          .map(j => (j.children[0] ? j.children[0].data : ''), '\n'),
      );
    });

  return answers.map((i, j) => [j + 1, i.indexOf('1')]);
};

const TASK_METHODS = {
  0: answersForSimple,
  1: answersForTable,
  2: answersForOpen,
  3: answersForStructurized,
};

const parseAnswers = async (tagID, ids) => {
  try {
    // Do a request to get answers from server
    const res = await axios.post(
      `${URL}/users/znotest/tag/`,
      stringify({ do: 'send_all_serdata', tag_id: tagID }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );
    if (!res || !res.data) throw new Error('Неудача при запросе ответов');

    // Array, where we will store task's data
    const data = JSON.parse(fs.readFileSync(`${PATH}/config.json`, 'utf-8'));

    // Find tasks and store them in array
    const markup = res.data.result.quest.replace(/\t/g, '').replace(/\n/g, '');
    const $ = cheerio.load(replaceNames(markup));
    const tasks = $('.task-card');

    // Go through all tasks and look for answers
    tasks.each((i, _task) => {
      const task = $(_task);

      // Get task type. It will help us in choosing answers find algorhythm
      const taskType =
        TASK_TYPES[task.find('.description a[href^="/dovidka/"]')[0].children[0].data];

      // Get task id to link answers in config
      const id = ids[i];

      // If we got task type that we don't need, return
      const answer = TASK_METHODS[taskType] ? TASK_METHODS[taskType](task, i) : null;
      if (answer !== 0 && !answer) return console.log('Нет ответа', id);

      // Add answers to config
      const taskInConfig = data.find(j => j.id === id);
      if (taskInConfig) {
        taskInConfig.answer = answer;
        taskInConfig.taskType = taskType;
      }

      // Save config
      fs.writeFileSync(`${PATH}/config.json`, JSON.stringify(data, null, 2));
    });
  } catch (err) {
    console.error('Парсинг ответов', err);
  }
};

module.exports = async () => {
  // Clear old config file content
  if (!fs.existsSync(PATH)) fs.mkdirSync(PATH);
  if (!fs.existsSync(`${PATH}/config.json`)) await fs.writeFileSync(`${PATH}/config.json`, '[]');

  // Go through all specified URLs
  for await (const i of Object.entries(urls)) {
    const subject = i[0];
    for await (const url of i[1]) {
      parseTasks(url, subject);
      await sleep(15000);
    }
  }
};
