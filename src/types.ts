export { Test };

type Test = {
	desc: string;
	query: [string, string, string];
	expected: boolean;
	result?: boolean;
};
