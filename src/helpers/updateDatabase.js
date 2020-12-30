'use strict';

const fs = require('fs');
const { stringify } = require('querystring');
const axios = require('axios');
const cheerio = require('cheerio');

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

const URL = 'https://zno.osvita.ua';
const PATH = './tasks';

const downloadImage = async (taskID, fileName, imageURL) => {
  if (fs.existsSync(`${PATH}/${taskID}/${fileName}`)) return;
  const answer = await axios.get(`${URL}${imageURL}`, { responseType: 'arraybuffer' });
  if (!answer || !answer.data) throw new Error('Неудача при скачивании изображения');

  if (!fs.existsSync(PATH)) fs.mkdirSync(PATH);
  if (!fs.existsSync(`${PATH}/${taskID}`)) fs.mkdirSync(`${PATH}/${taskID}`);

  fs.writeFileSync(`${PATH}/${taskID}/${fileName}`, answer.data);
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const parseTasks = async (url, subject) => {
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

  tasks.each((i, _task) => {
    const task = $(_task);

    // Get ID, task image and explanation
    const id = task[0].attribs.class.split('card_')[1];
    const taskImage = task.find('.question img')[0].attribs.src;
    const explanation = task.find(`.explanation img`)[0].attribs.src;

    // Download images to local store
    downloadImage(id, 'task.png', taskImage);
    downloadImage(id, 'explanation.png', explanation);

    data.push({ id, taskImage, explanation, subject, tag });
  });

  // Update config
  fs.writeFileSync(`${PATH}/config.json`, JSON.stringify(data, null, 2));

  // Next step: parse answers for tasks
  parseAnswers(tagID);
};

const parseAnswers = async tagID => {
  const res = await axios.post(
    `${URL}/users/znotest/tag`,
    stringify({ do: 'send_all_serdata', tag_id: tagID }),
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    },
  );
  if (!res || !res.data) throw new Error('Неудача при запросе ответов');

  // ...
};

module.exports = async () => {
  // Clear old config file content
  await fs.writeFileSync(`${PATH}/config.json`, '[]');

  // Go through all specified URLs
  Object.entries(urls).forEach(_subject => {
    const subject = _subject[0];
    parseTasks(_subject[1][0], subject);

    // _subject[1].forEach(url => {
    //   parseTasks(url, subject);
    // });
  });
};
