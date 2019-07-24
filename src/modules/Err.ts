interface ErrIF {
  pop(msg: string): void;
}

class Err implements ErrIF {
  pop(msg: string) {
    throw new Error(msg);
  }
}

export { ErrIF };
export default Err;
