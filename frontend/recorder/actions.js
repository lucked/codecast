
export const recorderStart = {
  type: 'Recorder.Start',
  description: "Sent by the user to actually start recording."
};

export const recorderPause = {
  type: 'Recorder.Pause',
  description: "Sent by the user to pause recording."
};

export const recorderStop = {
  type: 'Recorder.Stop',
  description: "Sent by the user to stop and finalize recording."
};

export const recorderBack = {
  type: 'Recorder.Back',
  description: "Sent by the user, while recording is paused, to remove the last recorded segment from the recording."
};

export const recorderPreparing = {
  type: 'Recorder.Preparing',
  description: "Sent by a saga in reaction to recorderPrepare, when preparation for recording starts."
};

export const recorderReady = {
  type: 'Recorder.Ready',
  description: "Sent by a saga when ready to record."
};

export const recorderStarted = {
  type: 'Recorder.Started',
  description: "Sent by a saga in reaction to recorderStart, when recording effectively starts."
};

export const recorderStopping = {
  type: 'Recorder.Stopping',
  description: "Sent by a saga in reaction to recorderStop, when we begin assembling the recording."
};

export const recorderStopped = {
  type: 'Recorder.Stopped',
  description: "Sent by a saga when recording has stopped and the recorder is ready to start a new recording."
};

export const recorderTick = {
  type: 'Recorder.Tick',
  description: "Sent every second while recording."
};

export const audioWorkerMessage = {
  type: 'Recorder.AudioWorker.Message',
  description: "Sent by the audio worker."
};