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
  abstract defaults(): Attributes;
  abstract mutations(): Mutations;
}

export interface IFilterIteration<M extends BaseModel> {
  (item: M, index: number): boolean;
}
export interface IItem extends Object {
  [key: string]: any;
}

export interface ISend {
  (data?: any): Promise<{ content: any[]; pages: number }>;
}
