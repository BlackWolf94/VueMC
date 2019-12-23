/**
 * @author Dimitry Zataidukh
 * @created_at 11/25/19
 */
/* tslint:disable:no-console */

const isDev = process.env.NODE_ENV !== 'production';

export function  ErrorHandler() {
  return (target: any, key: string, descriptor: TypedPropertyDescriptor<any>): any => {
    const method: Function = descriptor.value;
    descriptor.value = function() {
        if (isDev) {
          console.time(`${this.constructor.name}: ${key}`);
        }
        try {
          (this as any).error = null;
          return method.apply(this, arguments);
        } catch (e) {
          (this as any).error = e;
          throw e;
        } finally {
          if (isDev) {
            console.timeEnd(`${this.constructor.name}: ${key}`);
          }
        }
      };
    return descriptor;
  };
}
