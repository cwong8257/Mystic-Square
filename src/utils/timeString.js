import leftPad from './leftPad'

function timeString (seconds) {
  const minutes = Math.floor(seconds / 60)
  seconds -= minutes * 60
  return `${leftPad(minutes)}:${leftPad(seconds)}`
}

export default timeString
