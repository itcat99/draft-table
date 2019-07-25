class A {
  private _name: string;
  protected _age: number;

  public constructor() {
    this._name = "hahaha";
    this._age = 18;
  }

  public getName() {
    return this._name;
  }

  public setName(name: string) {
    this._name = name;
  }
}

class B extends A {
  public constructor() {
    super();

    console.log((this._age = 15));
  }
}

const a = new A();
const b = new B();

console.log("a name: ", a.getName());
a.setName("Hello");
console.log("a name second: ", a.getName());
// console.log("a name 3: ", a._name);

const fn = <T>(first: T): T => first;
