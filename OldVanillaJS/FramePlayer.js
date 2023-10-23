

export default class FramePlayer {

  // State
  currentFrame = 0;
  isPlaying;
  frames = [];

  // Event listeners
  onPlayStateChange;

  play() {

    console.log("starting run of", this.frames)

    if (this.currentFrame >= this.frames.length - 1) this.reset();
    
    this.isPlaying = true;

    if (this.onPlayStateChange) this.onPlayStateChange();

    this.runFrameCycle();
  }

  pause() {
    this.isPlaying = false;
    if (this.onPlayStateChange) this.onPlayStateChange();
  }

  reset() {
    this.currentFrame = 0;
    console.warn("You probably want more functionality built into reset.")
  }

  runFrameCycle() {

    // Pause if empty or at the end
    if (this.currentFrame >= this.frames.length) this.pause();

    // Check if should be running
    if(!this.isPlaying) return;

    // Run the frame
    this.runFrame(this.currentFrame, this.runFrameCycle);

    // Update frame tracker
    this.currentFrame += 1;

  }

  runFrame(frameNumber, onFinish) {
    throw Error("runFrame() must be overridden");
  }

  isPlaying() {
    return this.isPlaying;
  }

  currentFrame() {
    return this.currentFrame;
  }

}