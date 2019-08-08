import { Id_Type, ComponentProps_I } from "types/common.type";

class Component {
  private _id: Id_Type;
  constructor(porps: ComponentProps_I) {
    this._id = porps.id || Symbol();
  }

  getId() {
    return this._id;
  }
}

export default Component;
