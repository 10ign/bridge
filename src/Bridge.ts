/** Interfaces */
import { IClass } from '@10ign/common-types';

/**
 * Class which extends the base Error and can be identified as a specific error
 * related to bridge implementation.
 */
export class BridgeImplementationError extends Error {
  /**
   * Creates an instance for Bridge implementation error.
   *
   * @param message Error message
   */
  constructor(message: string) {
    super(message);
    this.name = 'BridgeImplementationError';
  }
}

/**
 * Class which bridges external implementation for a specific abstract class.
 * Will throw error when implementation is missing and access is performed.
 */
export class Bridge<Type> {
  /**
   * The current implementation for the bridge.
   * This value will be `null` until an implementation is set.
   */
  #currentImplementation: Type | null;

  /**
   * Abstract Class used for creating the bridge.
   */
  #abstractClassDefinition: IClass<Type>;

  /**
   * Creates an instance for a bridged implementation.
   *
   * @param abstractClass Abstract class to be implemented
   */
  constructor(abstractClass: IClass<Type>) {
    this.#abstractClassDefinition = abstractClass;
    this.#currentImplementation = null;
  }

  /**
   * Returns the abstract class that will be bridged.
   *
   * @sealed
   * @returns Class type for the bridge implementation
   */
  get abstractClass(): IClass<Type> {
    return this.#abstractClassDefinition;
  }

  /**
   * Returns the implementation class' instance which extended the abstract
   * class and was defined by the `setImplementation` method.
   *
   * @sealed
   * @returns Implementation class instance
   */
  get implementation(): Type {
    if (!this.#currentImplementation) {
      const name: string = this.#abstractClassDefinition.name;
      throw new BridgeImplementationError(
        `Missing bridge implementation for abstract class "${name}"`
      );
    }

    return this.#currentImplementation;
  }

  /**
   * Sets the implementation class' instance that will be used by the bridge.
   *
   * @sealed
   * @param implementation - Implementation class' instance
   */
  setImplementation(implementation: Type): void {
    if (!(implementation instanceof this.abstractClass)) {
      const { name } = this.#abstractClassDefinition;
      throw new BridgeImplementationError(
        `Bridge implementation does not extend abstract class "${name}"`
      );
    }

    this.#currentImplementation = implementation;
  }
}
