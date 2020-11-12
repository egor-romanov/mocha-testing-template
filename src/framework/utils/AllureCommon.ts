import { attachment, step } from 'ts-test-decorators';
import { ContentType } from 'allure2-js-commons';

export class AllureCommons {
  @step((name) => String(name))
  static attachText(name: string, value: string): string {
    return this._attachText(value);
  }

  @attachment('Attachment', ContentType.TEXT)
  private static _attachText(value: string): string {
    return value;
  }
}
