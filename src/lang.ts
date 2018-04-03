const ru = {
    title: 'Ear Gym',
    loading: "Загрузка",
    music: "Музыка",
    piano: "Фортепиано",
    drums: "Ударная установка",
    electricguitar: "Электрогитара",
    eqplus: "Эквалайзер усиление",
    eqplusdesc: "Нужно услышать какая частота была усилена",
    level: "Уровень",
    stage: "Этап",
    lives: "Жизни",
    hz: "Гц",
    fxon: "Вкл",
    fxoff: "Выкл",
    gameOver: "Игра окончена",
    error: "Ошибка",
}
const en: typeof ru = {
    title: "Ear Gym",
    loading: "Loading",
    music: "Music",
    piano: "Piano",
    drums: "Drum kit",
    electricguitar: "Electric guitar",
    eqplus: "Equalizer boost",
    eqplusdesc: "Find boosted frequency",
    level: "Level",
    stage: "Stage",
    lives: "Lives",
    hz: "Hz",
    fxon: "Fx on",
    fxoff: "Fx off",
    gameOver: "Game over",
    error: "Error",
}

const l = navigator.language === 'ru' ? ru : en;
export default l;