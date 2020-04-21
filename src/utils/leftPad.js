function leftPad (val) {
  if (typeof val === 'number') {
    val = val.toString()
  }

  if (val.length < 2) {
    val = '0' + val
  }

  return val
}

export default leftPad
