# 以下是**Emitter**类型定义

## Event_I

Emitter 事件接口

```ts
interface Event_I {
  type: EventType_Enum;
  cb: Callback_I;
}
```

## Callback_I

Emitter 事件回调函数接口

```ts
interface Callback_I {
  (...props: any[]): void;
}
```

## Events_Type

Emitter 事件集合类型

```ts
type Events_Type = Map<string, Event_I>;
```
