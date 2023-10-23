
import { Frame } from "./AlgorithmDataTypes.js"

export default abstract class FramePlayer {

  // State
  protected currentFrameNumber: number = 0;
  protected framesArePlaying = false;
  protected frames: Frame[] = [];

  // Event listeners
  onPlayStateChange: (() => void) | undefined;

  /**
   * Constructor.
   */
  constructor() {
  }

  /**
   * Start the frame runner.
   */
  public play(): void {

    if (this.currentFrameNumber > this.frames.length - 1) this.reset();
    
    this.framesArePlaying = true;

    if (this.onPlayStateChange) this.onPlayStateChange();

    this.runFrameCycle();
  }

  /**
   * Stop the frame runner.
   */
  public pause(): void {
    this.framesArePlaying = false;
    if (this.onPlayStateChange) this.onPlayStateChange();
  }

  /**
   * Reset the frame runner to the base state.
   */
  abstract reset(): void;

  /**
   * Run one cycle of frames.
   * 
   * @returns void
   */
  protected runFrameCycle(): void {

    // Pause if empty or at the end
    if (this.currentFrameNumber >= this.frames.length) this.pause();

    // Check if should be running
    if(!this.framesArePlaying) return;

    // Run the frame
    this.runFrame(this.currentFrameNumber, () => this.runFrameCycle());

    // Update frame tracker
    this.currentFrameNumber += 1;

  }

  isPlaying(): boolean {
    return this.framesArePlaying;
  }

  currentFrame(): number {
    return this.currentFrameNumber;
  }

  abstract runFrame(frameNumber: number, onFinish: () => void): void;

}