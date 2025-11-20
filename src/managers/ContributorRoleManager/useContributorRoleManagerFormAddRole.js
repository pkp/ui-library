import {useForm} from '@/composables/useForm';
import {useLocalize} from '@/composables/useLocalize';
import {useApp} from '@/composables/useApp';

export function useContributorRoleManagerAddRole({
	apiUrl,
	contributorRoleIdentifiers,
	contributorRole,
}) {
	const {t} = useLocalize();

	const {
		form,
		initEmptyForm,
		addPage,
		addGroup,
		addFieldText,
		addFieldSelect,
		getField,
		setAction,
		setMethod,
		setValues,
	} = useForm({});

	const {getSupportedFormLocales} = useApp();
	const supportedFormLocales = Object.keys(getSupportedFormLocales());

	// Add form
	const identifierOptions =
		contributorRoleIdentifiers.value?.map((identifier) => ({
			value: identifier,
			label: identifier,
		})) ?? [];
	const firstIdentifier = contributorRoleIdentifiers.value?.[0];
	const defaultNameValues = supportedFormLocales.reduce((val, l) => {
		val[l] = '';
		return val;
	}, {});

	/**
	 * Set form
	 */

	initEmptyForm('editContributorRole', {
		action: apiUrl.value,
	});

	addPage('default', {
		submitButton: {label: t('common.save')},
	});

	addGroup('default');

	addFieldSelect('contributorRoleIdentifier', {
		label: t('manager.contributorRoles.identifier'),
		isRequired: true,
		options: identifierOptions,
		value: firstIdentifier,
	});

	addFieldText('name', {
		label: t('manager.contributorRoles.name'),
		description: t('manager.contributorRoles.name.description'),
		isMultilingual: true,
		isRequired: true,
		value: defaultNameValues,
	});

	/**
	 * Set Values when editing
	 */

	if (contributorRole) {
		// Disallow edit of identifier
		const fieldIdentifier = getField('contributorRoleIdentifier');
		fieldIdentifier.options = [
			{
				value: contributorRole.contributorRoleIdentifier,
				label: contributorRole.contributorRoleIdentifier,
			},
		];

		setValues({
			...contributorRole,
		});
		setMethod('PUT');
		setAction(`${apiUrl.value}/${contributorRole.id}`);
	}

	return form;
}
