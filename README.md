# Ear Gym

[https://eargym.gitlab.io](https://eargym.gitlab.io)

Онлайн тренировка ушей с использованием Web Audio API

## TODO
- [ ] Fix volume for every sample, remove pre-compressor in saturator
- [ ] Fix render without AudioContext (to make it crawlable via google)
- [ ] Other games: 3 button (A, both, B): distortion, reverb?, compressor
- [ ] Other games: delay
- [ ] Icons for musicTypes
- [ ] ServiceWorker for offline mode (maybe the one which is build-in into webpack)
- [ ] Update React (or add polyfill), use getDerivedStateFromProps instead of key-binding to component instance
- [ ] Add some build timestamp (via webpack plugin or similar)
- [ ] Hardcore modes when no possible to change fx state: turn fx on after 3 seconds; fx is on permanently
- [x] Fix volume for piano
- [x] Possibility to hear sound with and without fx after answer
- [x] Gain game
- [x] Refactor gameRenders
- [x] Simplify challenge at low levels
- [x] possibility to start game at last achieved level
- [x] tothink: to clear lives on level start?
