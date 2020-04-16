/**
 * @author Dmitro Zataidukh
 * @email zidadindimon@gmail.com
 * @createdAt 4/9/20
 */

/* tslint:disable:max-classes-per-file */

export class ConfigureApiException extends Error {
  constructor(className: string, methodName: string) {
    super(`${className}: ${methodName} api method not configure`);
  }
}

export class ValidateException extends Error {}
