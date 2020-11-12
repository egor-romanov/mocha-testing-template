import { suite, test } from '@testdeck/mocha';
import { assert } from 'chai';
import { step } from 'ts-test-decorators';

@suite
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Hi {
  @test
  async successTest(): Promise<void> {
    this.stepExample();
    assert(true);
  }

  @test
  async failTest(): Promise<void> {
    this.stepExample();
    assert(false, 'failed test example');
  }

  @step('This is a step example')
  stepExample(): void {
    return;
  }
}
