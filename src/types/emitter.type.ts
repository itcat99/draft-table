export enum EventTypes_Enum {
  ON = "on",
  ONCE = "once",
}

export interface Event_I {
  type: EventTypes_Enum;
  cb: Function;
}
// 单个event注册的所有事件集合
export interface Events_I {
  [key: string]: Event_I[];
}
// 所有 event 集合
export interface Emitters_I {
  [key: string]: Events_I;
}

export interface Callback_I {
  (...props: any[]): void;
}
