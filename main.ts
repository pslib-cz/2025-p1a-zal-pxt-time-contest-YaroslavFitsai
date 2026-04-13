/*  TimeContest  */

enum GameState {
    Passive,   // čekání – hráč může zobrazit skóre nebo spustit hru
    Started,   // přehrávání intervalu – zobrazeny přesýpací hodiny
    Running    // hráč odhaduje – zobrazuje se otazník, měří se čas
}

let state: GameState = GameState.Passive
let targetInterval: number = 0   // sekundy (5–15)
let startTime: number = 0        // ms – základ pro měření
let score: number = 0
let targetIntervalMs: number = 0

input.onButtonPressed(Button.AB, function() {
    if (state === GameState.Passive) {
        targetInterval = randint(5, 15)
        state = GameState.Started
        targetIntervalMs = targetInterval * 1000
    }
})
input.onButtonPressed(Button.B, function() {
    if (state === GameState.Passive) {
        basic.showNumber(score)
    }
})
basic.forever(function() {
    if (state === GameState.Started) {
        basic.showIcon(IconNames.Pitchfork)
        control.runInBackground(() => music.playTone(440, 200))
        basic.pause(targetIntervalMs)
        control.runInBackground(() => music.playTone(640, 200))
        startTime = control.millis()
        state = GameState.Running
        basic.showIcon(IconNames.Square)
    }
})
input.onLogoEvent(TouchButtonEvent.Touched, function() {
    if (state === GameState.Running) {
        basic.clearScreen()
        let finalTime: number = control.millis() - startTime
        let tolerance: number = 250 + targetIntervalMs * 0.1
        let time: number = targetIntervalMs - tolerance
        if (time <= finalTime && finalTime <= targetIntervalMs) {
            basic.showIcon(IconNames.Happy)
            music.playTone(523, 200) // Tón C5
            basic.pause(100)
            music.playTone(659, 200) // Tón E5
            basic.pause(100)
            music.playTone(784, 400) // Tón G5
            let dil: number = tolerance/9
            let body: number = Math.round((finalTime - time)/dil)
            if (body > 9) {
                body = 9
            }
            if (body < 1) {
                body = 1
            }
            score = score + body
        } else {
            basic.showIcon(IconNames.Sad)
            music.playTone(196, 300) // Tón G3
            basic.pause(100)
            music.playTone(131, 500) // Tón C3
        }
        basic.clearScreen()
        state = GameState.Passive
    }
})