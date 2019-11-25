/**
 * @author Dimitry Zataidukh
 * @created_at 11/25/19
 */

export function ErrorHandler() {
  return (target: any, key: string, descriptor: TypedPropertyDescriptor<any>): any => {
    const method: Function = descriptor.value;
      descriptor.value = function() {
        try {
          return method.apply(this, arguments);
        } catch (e) {
          throw e;
        }
      };
      return descriptor;
  }
};
