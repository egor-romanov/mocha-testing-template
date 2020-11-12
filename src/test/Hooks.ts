import { SocketClient } from '../framework/helpers/SocketClient';
import { step } from 'ts-test-decorators';

const ADMIN_URL = process.env.ADMIN_URL || 'localhost:8080';
// const APP_URL = process.env.APP_URL || 'localhost:8081';

export default class Hooks {
  clientAdmin: SocketClient;
  clientApp: SocketClient;

  @step('Suite setup')
  public static before(): void {
    console.log('before suite');
  }

  @step('Suite teardown')
  public static after(): void {
    console.log('after suite');
  }

  // @step('Test setup') this one is broken
  public before(): void {
    this.clientAdmin = new SocketClient(ADMIN_URL);
  }

  // @step('Test teardown') this one is broken
  public after(): void {
    this.clientAdmin.close();
  }
}
