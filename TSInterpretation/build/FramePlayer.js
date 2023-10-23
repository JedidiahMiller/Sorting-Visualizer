export default class FramePlayer {
    constructor() {
        this.currentFrameNumber = 0;
        this.framesArePlaying = false;
        this.frames = [];
    }
    play() {
        if (this.currentFrameNumber > this.frames.length - 1)
            this.reset();
        this.framesArePlaying = true;
        if (this.onPlayStateChange)
            this.onPlayStateChange();
        this.runFrameCycle();
    }
    pause() {
        this.framesArePlaying = false;
        if (this.onPlayStateChange)
            this.onPlayStateChange();
    }
    runFrameCycle() {
        if (this.currentFrameNumber >= this.frames.length)
            this.pause();
        if (!this.framesArePlaying)
            return;
        this.runFrame(this.currentFrameNumber, () => this.runFrameCycle());
        this.currentFrameNumber += 1;
    }
    isPlaying() {
        return this.framesArePlaying;
    }
    currentFrame() {
        return this.currentFrameNumber;
    }
}
