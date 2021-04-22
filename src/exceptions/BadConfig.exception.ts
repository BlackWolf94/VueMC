export class BadConfigException extends Error {
  constructor(className: string, methodName: string) {
    super(`${className}: ${methodName} api method not configure`);
  }
}
