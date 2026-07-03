import leftPad from './leftPad'

const SECONDS_PER_MINUTE = 60

const timeString = (seconds: number): string => {
  const minutes = Math.floor(seconds / SECONDS_PER_MINUTE)
  const remainingSeconds = seconds % SECONDS_PER_MINUTE
  return `${leftPad(minutes)}:${leftPad(remainingSeconds)}`
}

export default timeString
