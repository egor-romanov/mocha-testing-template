import { decorate } from 'ts-test-decorators';

export function mochaGlobalSetup(): void {
  decorate(global['allure']);
}
