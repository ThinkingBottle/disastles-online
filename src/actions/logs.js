export const ADD_LOG = 'ADD_LOG';
export const FADE_OUT_LOG = 'FADE_OUT_LOG';
export const DELETE_LOG = 'DELETE_LOG';

export function addLog (logType, data) {
  return {
    type: ADD_LOG,
    log: {
      timestamp: new Date(),
      logType,
      data,
    },
  };
}

export function fadeOutLog (log) {
  return {
    type: FADE_OUT_LOG,
    log,
  };
}

export function deleteLog (log) {
  return {
    type: DELETE_LOG,
    log,
  };
}
