export enum EventTypes_Enum {
  ON = "on",
  ONCE = "once",
}

export interface Event_I {
  type: EventTypes_Enum;
  cb: Function;
}

export interface Events_I {
  [key: string]: Event_I[];
}

export interface Emitters_I {
  [key: string]: Events_I;
}

export interface Callback_I {
  (...props: any[]): void;
}
