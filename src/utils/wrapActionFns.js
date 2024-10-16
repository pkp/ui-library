export function wrapActionFns(Actions, ActionsFns, wrapperFn) {
	return Object.values(Actions).reduce((acc, actionName) => {
		acc[actionName] = (actionArgs, finishedCallback) =>
			wrapperFn(ActionsFns[actionName], actionArgs, finishedCallback);

		return acc;
	}, {});
}
