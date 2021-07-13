import { LitElement } from 'lit';
import { interpret, MachineConfig } from 'xstate';

export type Constructor<T> = new (...args: unknown[]) => T;

export interface ClassDescriptor {
    kind: 'class';
    elements: ClassElement[];
    finisher: <T>(targetClass: Constructor<T>) => undefined | Constructor<T>;
}

export interface ClassElement {
    kind: 'field' | 'method';
    key: PropertyKey;
    placement: 'static' | 'prototype' | 'own';
    initializer?: () => void;
    extras?: ClassElement[];
    finisher?: <T>(targetClass: Constructor<T>) => undefined | Constructor<T>;
    descriptor?: PropertyDescriptor;
}

export interface OptionTypes {
    machine: any;
}

/**
 * useStateMachine
 * extended from: https://github.com/web-ui-dev/lit-statemachine/blob/master/src/index.ts
 */
export const useStateMachine = (
    targetClass: Constructor<LitElement>,
    { machine }: OptionTypes
): Constructor<LitElement> => {
    return class extends targetClass {

        context: any;

        constructor(context: any) {
            super();
            this.context = context;
        };

        withContext = {} as any;

        machine = {} as any;

        send = () => {};

        connectedCallback() {

            this.withContext = machine.withContext({
                values: {
                    ...machine.context.values,
                    ...JSON.parse(this.context)
                }
            });

            this.machine = interpret(this.withContext);

            this.send = this.machine.send;

            this.machine.start();

            this.machine.onTransition((state: any) => {
                if (state.changed) this.requestUpdate();
            });

            super.connectedCallback();
        }

        disconnectedCallback() {
            this.machine.stop();

            super.disconnectedCallback();
        }
    };
};