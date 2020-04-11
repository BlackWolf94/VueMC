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
     * @this Model | Collection
     */
    descriptor.value = async function() {
      if (isDev) {
        console.time(`${this.constructor.name}: ${key}`);
      }
      try {
        this.before();
        const res = await method.apply(this, arguments);
        this.after();
        return res;
      } catch (e) {
        this.onError(e);
      } finally {
        if (isDev) {
          console.timeEnd(`${this.constructor.name}: ${key}`);
        }
      }
    };
    return descriptor;
  };
}
