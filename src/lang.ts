const ru = {
    title: "Ear Gym",
    welcome: "Добро пожаловать в Ear Gym!",
    welcome2: "Здесь вы можете тренировать свои уши",
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
    gameOver: "Игра окончена",
    exit: "Выход",
    startAgain: "Начать уровень снова",
    error: "Ошибка",
    gain: "Громкость",
    gaindesc: "Нужно услышать усиление/подавление громкости в дБ",
    back: "Назад"
};
const en: typeof ru = {
    title: "Ear Gym",
    welcome: "Welcome to Ear Gym!",
    welcome2: "Here you can train you ears",
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
    gameOver: "Game over",
    exit: "Exit",
    startAgain: "Start level again",
    error: "Error",
    gain: "Volume",
    gaindesc: "Find volume boost/reduce in dB",
    back: "Back"
};

function browserLocale() {
    let lang: string = "";

    if (navigator.languages && navigator.languages.length) {
        // latest versions of Chrome and Firefox set this correctly
        lang = navigator.languages[0];
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
