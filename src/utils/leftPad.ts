const MIN_LENGTH = 2

const leftPad = (val: number | string): string => {
  let strVal = `${val}`

  if (strVal.length < MIN_LENGTH) {
    strVal = `0${strVal}`
  }

  return strVal
}

export default leftPad
