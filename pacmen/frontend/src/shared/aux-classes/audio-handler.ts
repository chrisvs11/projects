export class AudioHandler {
    private audio:HTMLAudioElement

    constructor(audio:HTMLAudioElement) {
        this.audio = audio
    }

    setVolume(volume:number):boolean {
        this.audio.volume  = volume
        return true
    }

    stop():void {
        this.audio.pause()
        return 
    }

    play(volume:number = 1):boolean {
        this.audio.play()
        this.setVolume(volume)
        return true
    }

    setLoopState(state:boolean):boolean {
        this.audio.loop = state
        return true
    }

}