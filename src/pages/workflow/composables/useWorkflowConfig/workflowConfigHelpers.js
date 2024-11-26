// Useful for some common functionality thats covered in Config.common,
// like permissions or Stage not initiated
export function consolidateCommonAndSpecificItems(
	Config,
	configItemKey,
	getterFnName,
	itemsArgs,
) {
	const commonItems = Config?.common?.[getterFnName]?.(itemsArgs);

	// early return, if common logic decides there should not be any specific items displayed
	if (commonItems?.shouldContinue === false) {
		return commonItems?.items || [];
	}

	return [
		...(commonItems?.items || []),
		...(Config?.[configItemKey]?.[getterFnName]?.(itemsArgs) || []),
	];
}

export function addItemIf(items, item, condition) {
	if (condition) {
		items.push(item);
	}
}
