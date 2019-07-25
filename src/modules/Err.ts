interface Err_I {
  pop(msg: string): void;
}

class Err implements Err_I {
  pop(msg: string) {
    throw new Error(msg);
  }
}

export { Err_I };
export default Err;
