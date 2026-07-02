const MIN_LENGTH = 2

const leftPad = (val) => {
  let strVal = val
  if (typeof strVal === 'number') {
    strVal = strVal.toString()
  }

  if (strVal.length < MIN_LENGTH) {
    strVal = `0${strVal}`
  }

  return strVal
}

export default leftPad
