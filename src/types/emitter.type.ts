export enum EventType_Enum {
  ON = "on",
  ONCE = "once",
}

export interface Event_I {
  type: EventType_Enum;
  fn: Function;
}

export type Events_Type = Map<string, Event_I>;
