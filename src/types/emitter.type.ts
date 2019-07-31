export enum EventType_Enum {
  ON = "on",
  ONCE = "once",
}

export interface Event_I {
  type: EventType_Enum;
  cb: Callback_I;
}

export interface Callback_I {
  (...props: any[]): void;
}

export type Events_Type = Map<string, Event_I>;
