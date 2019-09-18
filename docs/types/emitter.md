# 以下是**Emitter**类型定义

## Event_I

Emitter 事件接口

```ts
interface Event_I {
  type: EventType_Enum;
  cb: Function;
}
```

## Events_I

单个 event 注册的所有事件集合

```ts
interface Events_I {
  [key: string]: Event_I[];
}
```

## Emitters_I

所有 Emitter 集合

```ts
interface Emitters_I {
  [key: string]: Events_I;
}
```

## EventTypes_Enum

Emitter 事件类型枚举

```ts
enum EventTypes_Enum {
  ON = "on",
  ONCE = "once",
}
```
