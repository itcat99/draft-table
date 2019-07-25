export interface Plugin_Collection_I {
  [namespace: string]: Plugin_I;
}

export interface Plugin_I {
  (...props: any[]): void;
}
