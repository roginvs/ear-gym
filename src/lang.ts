const ru = {
    title: 'Ear Gym',
    music: "Музыка"
}
const en: typeof ru = {
    ...ru
}

export const l = navigator.language === 'ru' ? 'ru' : 'en';