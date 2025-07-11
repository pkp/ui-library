/**
 * Should a field be shown?
 *
 * @param {Object} field One of this.fields
 * @return {Boolean}
 */
export function shouldShowFieldWithinGroup(field, allFields) {
	if (typeof field.showWhen === 'undefined') {
		return true;
	}
	const whenFieldName =
		typeof field.showWhen === 'string' ? field.showWhen : field.showWhen[0];
	const whenField = allFields.find((field) => field.name === whenFieldName);
	if (!whenField) {
		return false;
	}
	if (typeof field.showWhen === 'string') {
		return !!whenField.value;
	}

	const expectedValue = field.showWhen[1];
	if (Array.isArray(expectedValue)) {
		return expectedValue.includes(whenField.value);
	}

	return whenField.value === expectedValue;
}
/**
 * Should a group be shown?
 *
 * @param {Object} group One of this.groups
 * @return {Boolean}
 */
export function shouldShowGroup(group, fields) {
	if (typeof group.showWhen === 'undefined') {
		return true;
	}
	const whenFieldName =
		typeof group.showWhen === 'string' ? group.showWhen : group.showWhen[0];
	const whenField = fields.find((field) => field.name === whenFieldName);
	if (!whenField) {
		return false;
	}
	if (typeof group.showWhen === 'string') {
		return !!whenField.value;
	}
	if (Array.isArray(group.showWhen[1])) {
		return group.showWhen[1].includes(whenField.value);
	}
	return whenField.value === group.showWhen[1];
}

/**
 * Should a field be shown?
 *
 * @param {Object} field One field to check
 * @param {Object} fields All form fields
 * @param {Object} groups All form groups
 * @return {Boolean}
 */

export function shouldShowField(field, fields, groups) {
	const group = groups.find((group) => group.id === field.groupId);

	return (
		shouldShowGroup(group, fields) && shouldShowFieldWithinGroup(field, fields)
	);
}
