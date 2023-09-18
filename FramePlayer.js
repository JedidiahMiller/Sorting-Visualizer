

export default class FramePlayer {

  #frameAction;
  #timeInterval;
  #isRunning = false;

  constructor(runFrame, timeInterval) {
    this.#frameAction = runFrame;
    this.#timeInterval = timeInterval;

    if (this.#frameAction == null) throw new Error("FramePlayer must be provided all parameters (Missing action)");
    if (this.#timeInterval == null) throw new Error("FramePlayer must be provided all parameters (Missing timeInterval)");
  }

  start() {
    this.#isRunning = true;
    this.#runFrames();
  }

  stop() {
    this.#isRunning = false;
  }

  #runFrame() {
    console.log("Tick");
    this.#frameAction();
  }

  #runFrames() {
    // Check for changes in pause state
    if (this.#isRunning) {
      this.#runFrame();
      setTimeout(() => this.#runFrames(), this.#timeInterval);
    } else {
      this.stop();
    }
  }

  isRunning() {
    return this.#isRunning;
  }

}