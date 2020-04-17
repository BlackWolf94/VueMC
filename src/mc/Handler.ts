/**
 * @author Dimitry Zataidukh
 * @created_at 11/25/19
 */
/* tslint:disable:no-console */

const isDev = process.env.NODE_ENV !== 'production';

export function ExceptionHandler() {
  return (target: any, key: string, descriptor: TypedPropertyDescriptor<any>): any => {
    const method: Function = descriptor.value;

    /**
     * @this any
     */
    descriptor.value = async function() {
      if (isDev) {
        console.time(`${this.constructor.name}: ${key}`);
      }
      try {
        (this as any).before();
        return await method.apply(this, arguments);
      } catch (e) {
        if (isDev) {
          console.timeEnd(`${this.constructor.name}: ${key}`);
        }
        (this as any).after();
        (this as any).onError(e);
      } finally {
        (this as any).after();
      }
    };
    return descriptor;
  };
}
