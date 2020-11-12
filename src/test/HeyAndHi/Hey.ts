import { suite, test } from '@testdeck/mocha';
import { assert } from 'chai';
import Hooks from '../Hooks';
import { AllureCommons } from '../../framework/utils/AllureCommon';
import { AdminAuth } from '../../framework/api/AdminAuth';

@suite
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Hey extends Hooks {
  private _adminAuth: AdminAuth;

  before() {
    super.before();
    this._adminAuth = new AdminAuth(this.clientAdmin);
  }

  @test
  async signInAsRoot(): Promise<void> {
    try {
      const response = await this._adminAuth.signIn('ROOT','EMPTY_PASSWORD');

      AllureCommons.attachText('signIn response', JSON.stringify(response));
    } catch (err) {
      assert(false, JSON.stringify(err));
    }
  }

  @test
  async signInBySession(): Promise<void> {
    try {
      const { session, }  = await this._adminAuth.signIn('ROOT','EMPTY_PASSWORD');

      AllureCommons.attachText('signIn session', session);

      const { status, } = await this._adminAuth.signOut();

      assert(status === 'OK', `Expected status: "${status}" to be equal to "OK"`);

      const response = await this._adminAuth.signInBySession(session);

      AllureCommons.attachText('signInBySession response', JSON.stringify(response));
    } catch (err) {
      if (err.name === 'AssertionError') {
        throw err;
      } else {
        assert(false, JSON.stringify(err));
      }
    }
  }
}
