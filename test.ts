// enum EventTypes_Enum {
//   ON = "on",
//   ONCE = "once",
// }

// interface Event_I {
//   type: EventTypes_Enum;
//   cb: Function;
// }

// interface Events_I {
//   [key: string]: Event_I[];
// }

// interface Emitters_I {
//   [key: string]: Events_I;
// }

// class Emmiter {
//   emitters: Emitters_I;
//   constructor() {
//     this.emitters = {};
//   }

//   on(key: string, cb: Function, namespace?: string) {
//     this._registerEvent(EventTypes_Enum.ON, key, cb, namespace);
//   }

//   once(key: string, cb: Function, namespace?: string) {
//     this._registerEvent(EventTypes_Enum.ONCE, key, cb, namespace);
//   }

//   _registerEvent(type: EventTypes_Enum, key: string, cb: Function, namespace: string = "_GLOBAL_") {
//     const collection = this.emitters[namespace];
//     const event = {
//       type,
//       cb,
//     };

//     if (collection) {
//       const events = collection[key];
//       if (events) {
//         events.push(event);
//       } else {
//         collection[key] = [event];
//       }
//     } else {
//       this.emitters[namespace] = {
//         [key]: [event],
//       };
//     }
//   }

//   _search(key: string, namespace: string = "_GLOBAL_"): Event_I[] {
//     const collection = this.emitters[namespace];
//     if (collection) {
//       const events = collection[key];
//       if (events) return events;
//     }
//   }

//   fire(key: string, args: any[] = [], namespace: string = "_GLOBAL_") {
//     let events = this._search(key, namespace);
//     if (events) {
//       events = events.filter(event => {
//         const { type, cb } = event;
//         cb && cb(...args);

//         if (type === EventTypes_Enum.ON) {
//           return event;
//         }
//       });

//       this.emitters[namespace][key] = events;
//     }
//   }

//   del(key: string, cb: Function, namespace: string = "_GLOBAL_") {
//     let events = this._search(key, namespace);
//     if (events) {
//       events = events.filter(event => {
//         if (cb !== event.cb) return event;
//       });

//       this.emitters[namespace][key] = events;
//     }
//   }

//   clear() {
//     this.emitters = {};
//   }
// }
