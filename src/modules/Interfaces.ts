export interface Mutation {
  (value: any): any;
}

export interface Attributes {
  [key: string]: any;
}

export interface Mutations {
  [key: string]: Mutation;
}

export abstract class BaseModel {
  protected abstract init(attributes: Attributes);
  protected constructor(attributes: Attributes = {}) {
    this.init(attributes);
  }
  abstract get defaults(): Attributes;
  abstract get mutations(): Mutations;
}

export interface FilterIteration<M extends BaseModel> {
  (item: M, index: number): boolean;
}
export interface Item extends Object {
  [key: string]: any;
}

export interface send {
  (data?: any): Promise<{ content: any[]; pages: number }>;
}
