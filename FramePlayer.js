

export default class FramePlayer {

  // State
  #numberOfFrames;
  #currentFrame;
  #isRunning;

  // Event listeners
  onPlayStateChange;

  start() {

    if (this.#currentFrame === this.#numberOfFrames - 1) this.reset();
    
    this.#isRunning = true;

    if (this.onPlayStateChange) this.onPlayStateChange();

    this.#runFrameCycle();
  }

  pause() {
    this.#isRunning = false;
    if (this.onPlayStateChange) this.onPlayStateChange();
  }

  reset() {

    this.#currentFrame = 0;
  }

  #runFrameCycle() {

    if (!this.#isRunning) return;
    this.#runFrame(this.#currentFrame, this.#runFrameCycle);
    this.#currentFrame += 1;
    if (this.#currentFrame === this.#numberOfFrames) this.pause();

  }

  #runFrame(frameNumber) {
    throw Error("runFrame() must be overridden");
  }

  setFrameCount(count) {
    this.#numberOfFrames = count;
  }

}