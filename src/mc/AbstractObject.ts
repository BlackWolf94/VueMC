import TypeHelper from '@zidadindimon/js-typehelper';
import { IBase } from '../types';
import { ConfigureApiException } from './Exception';

/**
 * @author Dmitro Zataidukh
 * @email zidadindimon@gmail.com
 * @createdAt 4/10/20
 */

export abstract class AbstractObject<E, A> implements IBase<A> {
  protected dataLoading: boolean = false;

  protected dataErrors: string = null;

  protected apiProvider: Partial<A> = null;

  protected before(): void {
    this.dataLoading = true;
    this.dataErrors = null;
  }

  protected after(): void {
    this.dataLoading = false;
  }

  abstract get errors(): E;

  get hasError(): boolean {
    return !!this.dataErrors;
  }

  protected onError(exception: Error): void {
    throw exception;
  }

  get loading(): boolean {
    return this.dataLoading;
  }

  useApi(apiProvider: Partial<A>): this {
    this.apiProvider = apiProvider;
    return this;
  }

  protected api(): A {
    return null;
  }

  protected get getApiProvider(): Partial<A> {
    return this.apiProvider || this.api() || {};
  }

  protected getApiProvideMethod<K extends keyof A>(methodName: K): A[K] {
    const method: A[K] = this.getApiProvider[methodName];

    if (!TypeHelper.isFunction(method)) {
      throw new ConfigureApiException(this.constructor.name, methodName as string);
    }

    return method;
  }

  protected toggleLoading(loading?: boolean): this {
    this.dataLoading = loading === undefined ? !this.dataLoading : loading;
    return this;
  }
}
