import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { IClass } from '@10ign/common-types';
import { Bridge, BridgeImplementationError } from './Bridge';

describe('Bridge', () => {
  abstract class AbstractTest {
    abstract run<T>(...t: T[]): void;
  }

  class Test extends Bridge<AbstractTest> {
    constructor() {
      super(AbstractTest as IClass<AbstractTest>);
    }

    run<T>(...t: T[]): void {
      this.implementation.run(...t);
    }
  }

  let test: Test;

  beforeEach(() => {
    jest.clearAllMocks();
    test = new Test();
  });

  it('should instantiate Bridge', () => {
    expect(test).toBeInstanceOf(Bridge);
    expect(test).toBeInstanceOf(Test);
  });

  it('should have reference for the abstract class', () => {
    expect(test.abstractClass).toBe(AbstractTest);
  });

  it('should throw BridgeImplementationError if missing implementation', () => {
    const accessMissingImplementation = () => {
      test.run();
    };

    const error = new BridgeImplementationError(
      'Missing bridge implementation for abstract class "AbstractTest"'
    );
    expect(accessMissingImplementation).toThrowError(error);
  });

  it('should set the implementation', () => {
    const runSpy = jest.fn();
    class TestImplementation extends AbstractTest {
      run<T>(...t: T[]) {
        runSpy(...t);
      }
    }

    test.setImplementation(new TestImplementation());
    test.run<number | string>(123, 'abc');

    expect(runSpy).toHaveBeenCalledTimes(1);
    expect(runSpy).toHaveBeenCalledWith(123, 'abc');
  });

  it('should allow only implementation of the bridged type', () => {
    const runSpy = jest.fn();
    class TestImplementation {
      run<T>(...t: T[]) {
        runSpy(...t);
      }
    }

    const setInvalidImplementation = () => {
      test.setImplementation(new TestImplementation());
    };

    const error = new BridgeImplementationError(
      'Bridge implementation does not extend abstract class "AbstractTest"'
    );
    expect(setInvalidImplementation).toThrowError(error);
  });
});
