import { createMachine, assign } from 'xstate';
import { Test } from './types';

interface MachineProps {
	values: {
		tests: Test[],
		results: Test[],
		error?: string,
		input: string,
	};
};

const queryOso = async (values: MachineProps['values']) => {

	const oso = (window as any).oso;

	let Oso = new oso.Oso();

	try {
		await Oso.loadStr(values.input);
	} catch(error) {
		throw(error)
	};

	let results = [] as Test[];

	for (let q = 0; q < values.tests.length; q++) {

		let test = values.tests[q];

		let returned = await Oso.isAllowed(...test.query);

		let result: Test = {
			...test,
			result: returned,
		};

		results.push(result);;

	};  

	return results;

};

const queryStates = {
	id: 'queryStates',
	initial: 'idle',
	states: {
		idle: {

		},
		validate: {
			invoke: {
				src: ({values}: MachineProps) => async () => { 
					return await queryOso(values) 
				},
				onDone: { actions: 'cacheResult', target: 'resolve' },
				onError: { actions: 'cacheError', target: 'error.oso'},
			}, 
		},
		resolve: {
			always: [
				{ cond: 'isValid', target: 'valid' },
				{ target: 'invalid' }
			]
		},
		error: {
			states: {
				oso: {
				},
			},
		},
		valid: {
			
		},
		invalid: {

		},
	},
};

export const machine = createMachine<MachineProps>({
	id: 'lessonMachine',
	initial: 'idle',
	context: {
		values: {
			tests: [] as Test[],
			results: [] as Test[],
			input: '',
		},
	},
	states: {
		idle: {
			type: 'parallel',
			on: {
				SUBMIT: { actions: 'cacheInput', target: 'idle.query.validate' },
			},
			states: {
				query: { ...queryStates }, 
			}
		},
	}
},{

	actions: {

		cacheInput: assign({ values: ({values}: MachineProps, event: any) => ({ 
				...values,
				input: event.input,
			}) 
		}),

		cacheError: assign({ values: ({values}: MachineProps, event: any) => ({ 
				...values,
				results: [] as Test[],
				error: event.data,
			}) as any
		}),

		cacheResult: assign({ values: ({values}: MachineProps, event: any) => ({ 
				...values,
				results: event.data,
				error: undefined,
			}) as any
		})

	},

	guards: {

		isValid: ({values}: MachineProps) => 
			typeof values.results !== 'undefined' &&
			values.results.every(res => res.expected === res.result),

	},

});
