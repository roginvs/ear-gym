import * as React from "react";
const MUSIC_SOURCE_URL_PI = "https://www.youtube.com/watch?v=qdcqNA9qb_w";
const MUSIC_SOURCE_URL_EPIDEMIA = "http://www.epidemia.ru";

const ru = {
    title: "Ear Gym",
    welcome: "Добро пожаловать в Ear Gym!",
    welcome2: "Это онлайн платформа где вы можете тренировать свой слух",    
    loading: "Загрузка",
    music: "Музыка",
    piano: "Фортепиано",
    drums: "Ударная установка",
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
    startAgain: "Начать уровень снова",
    error: "Ошибка",
    gain: "Громкость",
    gaindesc: "Нужно услышать усиление/подавление громкости в дБ",
    back: "Назад",

    musicSourceInfo: <div><div>Музыка была заимствована из:</div>
         <div>Мюзикл <a href={MUSIC_SOURCE_URL_PI} target="blank">"Последнее испытание"</a></div>
         <div>Группа <a href={MUSIC_SOURCE_URL_EPIDEMIA} target="blank">"Эпидемия"</a></div></div>
         ,   

    fxSoundA: "Образец A",
    fxSoundB: "Образец B",
    saturation: "Насыщение (saturation)",
    saturationDesc: "Нужно услышать какой образец более насыщен",
    saturationChoiceA1: "Образец A",    
    saturationChoiceB1: "Образец B",
    saturationChoiceA2: "более насыщен",
    saturationChoiceB2: "более насыщен",
};
const en: typeof ru = {
    title: "Ear Gym",
    welcome: "Welcome to Ear Gym!",
    welcome2: "This is an online platform to train your ears",
    loading: "Loading",
    music: "Music",
    piano: "Piano",
    drums: "Drum kit",
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
    startAgain: "Start level again",
    error: "Error",
    gain: "Volume",
    gaindesc: "Find volume boost/reduce in dB",
    back: "Back",
    
    musicSourceInfo: <div><div>Music was taken from:</div>
         <div><a href={MUSIC_SOURCE_URL_PI} target="blank">"The Last Trial"</a> musical</div>
         <div><a href={MUSIC_SOURCE_URL_EPIDEMIA} target="blank">"Epidemia"</a> band</div></div>
         ,   

    fxSoundA: "Sample A",
    fxSoundB: "Sample B",

    saturation: "Saturation",
    saturationDesc: "Find what sound is more saturated",
    saturationChoiceA1: "Sample A",
    saturationChoiceB1: "Sample B",
    saturationChoiceA2: "is more saturated",
    saturationChoiceB2: "is more saturated",
};

function browserLocale() {
    let lang: string = "";

    if (navigator.languages && navigator.languages.length) {
        // latest versions of Chrome and Firefox set this correctly
        lang = navigator.languages.join(' ')
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
