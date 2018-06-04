const leftPad = val => {
  if (val.length < 2) {
    return `0${val}`;
  }
  return val;
};

export { leftPad };
