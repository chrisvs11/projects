export class AudioHandler {
    private audio:HTMLAudioElement

    constructor(audio:HTMLAudioElement) {
        this.audio = audio
    }

    setVolume(volume:0|1|0.5):boolean {
        this.audio.volume  = volume
        return true
    }

    stop():boolean {
        this.audio.pause()
        console.log("stopping audio ",this.audio.id)
        return true
    }

    play():boolean {
        this.audio.play()
        // console.log("playing audio ",this.audio.id)
        return true
    }

    setLoopState(state:boolean):boolean {
        this.audio.loop = state
        return true
    }

}