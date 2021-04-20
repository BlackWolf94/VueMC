import TypeHelper from '@zidadindimon/js-typehelper';
import { Base as IBase } from '../types';
import { BadConfigException } from './exceptions';

/**
 * @author Dmitriy Zataidukh
 * @email zidadindimon@gmail.com
 * @createdAt 4/10/20
 */

export abstract class Base<E, A> implements IBase<A> {
  protected dataLoading = false;

  protected dataErrors: string = null;

  protected apiProvider: Partial<A> = null;

  abstract get errors(): E;

  get hasError(): boolean {
    return !!this.dataErrors;
  }

  get loading(): boolean {
    return this.dataLoading;
  }

  protected clearErrors(): void {
    this.dataErrors = null;
  }

  protected get getApiProvider(): Partial<A> {
    return this.apiProvider || this.api() || {};
  }

  useApi(apiProvider: Partial<A>): this {
    this.apiProvider = apiProvider;
    return this;
  }

  protected before(): void {
    this.dataLoading = true;
    this.dataErrors = null;
  }

  protected after(): void {
    this.dataLoading = false;
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
    this.dataLoading = loading === undefined ? !this.dataLoading : loading;
    return this;
  }
}
