import TypeHelper from '@zidadindimon/js-typehelper';
import { Base as IBase } from './types';
import { BadConfigException } from './exceptions';
import { updateObjState } from './helper';

/**
 * @author Dmitriy Zataidukh
 * @email zidadindimon@gmail.com
 * @createdAt 4/10/20
 */

export abstract class Base<E, A> implements IBase<A> {
  readonly loading: boolean = false;

  protected dataErrors: string = null;

  protected apiProvider: Partial<A> = null;

  readonly errors: E = null;

  get hasError(): boolean {
    return !!this.errors;
  }

  protected clearErrors(): void {
    updateObjState(this, 'errors', null);
  }

  protected get getApiProvider(): Partial<A> {
    return this.apiProvider || this.api() || {};
  }

  useApi(apiProvider: Partial<A>): this {
    this.apiProvider = apiProvider;
    return this;
  }

  protected before(): void {
    this.toggleLoading(true);
    this.dataErrors = null;
  }

  protected after(): void {
    this.toggleLoading(false);
  }

  protected onError(exception: Error): void {
    throw exception;
  }

  protected api(): A {
    return null;
  }

  protected getApiProvideMethod<K extends keyof A>(methodName: K): A[K] {
    const method: A[K] = this.getApiProvider[methodName];

    if (!TypeHelper.isFunction(method)) {
      throw new BadConfigException(this.constructor.name, methodName as string);
    }

    return method;
  }

  protected toggleLoading(loading?: boolean): this {
    updateObjState(this, 'loading', loading === null ? !this.loading : loading);
    return this;
  }
}
