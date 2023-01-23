import * as React from "react";
const MUSIC_SOURCE_URL_PI = "https://www.youtube.com/watch?v=qdcqNA9qb_w";
const MUSIC_SOURCE_URL_EPIDEMIA = "http://www.epidemia.ru";
const MUSIC_SOURCE_COMPLEX_NUMBERS = "https://complexnumbers.ru/";

const ru = {
  title: "Ear Gym",
  welcome: "Добро пожаловать в Ear Gym!",
  welcome2: "Это онлайн платформа где вы можете тренировать свой слух",
  loading: "Загрузка",
  noWebAudioError:
    "Ваш браузер не поддерживает Web Audio API поэтому запустить это приложение невозможно",
  music: "Музыка",
  piano: "Фортепиано",
  drums: "Ударная установка",
  whitenoise: "Белый шум",
  electricguitar: "Электрогитара",
  eqplus: "Эквалайзер усиление",
  eqplusdesc: "Нужно услышать какая частота была усилена",
  eqminus: "Эквалайзер подавление",
  eqminusdesc: "Нужно услышать какая частота была подавлена",
  level: "Уровень",
  stage: "Этап",
  lives: "Жизни",
  hz: "Гц",
  db: "дБ",
  fxon: "Вкл",
  fxoff: "Выкл",
  //gameOver: "Игра окончена",
  startNextStage: "Далее",
  exit: "Выход",
  paused: "Пауза",
  startAgain: "Начать уровень снова",
  error: "Ошибка",
  gain: "Громкость",
  gaindesc: "Нужно услышать усиление/подавление громкости в дБ",
  back: "Назад",

  musicSourceInfo: (
    <span>
      Музыка была заимствована из:
      <br />
      Мюзикл{" "}
      <a href={MUSIC_SOURCE_URL_PI} target="blank">
        "Последнее испытание"
      </a>
      <br />
      Группа{" "}
      <a href={MUSIC_SOURCE_URL_EPIDEMIA} target="blank">
        "Эпидемия"
      </a>
      <br />
      Группа{" "}
      <a href={MUSIC_SOURCE_COMPLEX_NUMBERS} target="blank">
        "Complex Numbers"
      </a>
    </span>
  ),

  fxSoundA: "Образец A",
  fxSoundB: "Образец B",
  saturation: "Насыщение (saturation)",
  saturationDesc: "Нужно услышать какой образец более насыщен",
  saturationChoiceA1: "Образец A",
  saturationChoiceB1: "Образец B",
  saturationChoiceA2: "более насыщен",
  saturationChoiceB2: "более насыщен",

  graphicEqGameName: "Графический эквалайзер",
  graphicEqGameDescription: "Нужно настроить графический эквалайзер",
  fxSoundOriginal: "Оригинальный",
  fxSoundModified: "Изменённый",

  soundTheSame: "Так звучат одинаково",
};
const en: typeof ru = {
  title: "Ear Gym",
  welcome: "Welcome to Ear Gym!",
  welcome2: "This is an online platform to train your ears",
  loading: "Loading",
  noWebAudioError:
    "You browser does not support Web Audio API, thus it is impossible to run this application",
  music: "Music",
  piano: "Piano",
  drums: "Drum kit",
  whitenoise: "White noise",
  electricguitar: "Electric guitar",
  eqplus: "Equalizer boost",
  eqplusdesc: "Find boosted frequency",
  eqminus: "Equalizer cut",
  eqminusdesc: "Find cut frequency",
  level: "Level",
  stage: "Stage",
  lives: "Lives",
  hz: "Hz",
  db: "dВ",
  fxon: "Fx on",
  fxoff: "Fx off",
  //gameOver: "Game over",
  startNextStage: "Next",
  exit: "Exit",
  paused: "Paused",
  startAgain: "Start level again",
  error: "Error",
  gain: "Volume",
  gaindesc: "Find volume boost/reduce in dB",
  back: "Back",

  musicSourceInfo: (
    <span>
      Music was taken from:
      <br />
      <a href={MUSIC_SOURCE_URL_PI} target="blank">
        "The Last Trial"
      </a>{" "}
      musical
      <br />
      <a href={MUSIC_SOURCE_URL_EPIDEMIA} target="blank">
        "Epidemia"
      </a>{" "}
      band
      <br />
      <a href={MUSIC_SOURCE_COMPLEX_NUMBERS} target="blank">
        "Complex Numbers"
      </a>{" "}
      band
    </span>
  ),

  fxSoundA: "Sample A",
  fxSoundB: "Sample B",

  saturation: "Saturation",
  saturationDesc: "Find what sound is more saturated",
  saturationChoiceA1: "Sample A",
  saturationChoiceB1: "Sample B",
  saturationChoiceA2: "is more saturated",
  saturationChoiceB2: "is more saturated",

  graphicEqGameName: "Graphic equalizer",
  graphicEqGameDescription: "Need to set up graphic equalizer",
  fxSoundOriginal: "Original",
  fxSoundModified: "Modified",

  soundTheSame: "That sounds the same",
};

function browserLocale() {
  let lang: string = "";

  if (navigator.languages && navigator.languages.length) {
    // latest versions of Chrome and Firefox set this correctly
    lang = navigator.languages.join(" ");
    //    } else if (navigator.userLanguage) {
    //      // IE only
    //      lang = navigator.userLanguage
  } else {
    // latest versions of Chrome, Firefox, and Safari set this correctly
    lang = navigator.language;
  }

  return lang;
}
const l = browserLocale().indexOf("ru") > -1 ? ru : en;
export default l;
