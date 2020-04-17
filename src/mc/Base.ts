import { IBase } from '../types';
import { ConfigureApiException } from './Exception';
import TypeHelper from '@zidadindimon/js-typehelper';

/**
 * @author Dmitro Zataidukh
 * @email zidadindimon@gmail.com
 * @createdAt 4/10/20
 */

export abstract class Base<E, A> implements IBase<A> {
  protected _loading: boolean = false;
  protected _error: string = null;
  protected _apiProvider: Partial<A> = null;

  protected before() {
    this._loading = true;
    this._error = null;
  }

  protected after() {
    this._loading = false;
  }

  abstract get errors(): E;

  get hasError(): boolean {
    return !!this._error;
  }

  protected onError(exception: Error) {
    throw exception;
  }

  get loading() {
    return this._loading;
  }

  useApi(apiProvider: Partial<A>): this {
    this._apiProvider = apiProvider;
    return this;
  }

  protected api(): A {
    return null;
  }

  protected get apiProvider(): Partial<A> {
    return this._apiProvider || this.api() || {};
  }

  protected getApiProvideMethod<K extends keyof A>(methodName: K): A[K] {
    const method: A[K] = this.apiProvider[methodName];

    if (!TypeHelper.isFunction(method)) {
      throw new ConfigureApiException(this.constructor.name, methodName as string);
    }

    return method;
  }
}
