import {useForm} from '@/composables/useForm';
import {useLocalize} from '@/composables/useLocalize';
import {useApp} from '@/composables/useApp';

function setIdentifierOptions(options) {
	return options.map((identifier) => ({
		value: identifier,
		label: identifier,
	}));
}

export function useContributorRoleManagerAddRole({
	rolesApiUrl,
	contributorRoleFormData,
}) {
	const {t} = useLocalize();

	const {
		form,
		initEmptyForm,
		addPage,
		addGroup,
		addFieldText,
		addFieldSelect,
		setValues,
		getField,
	} = useForm({});

	const {getSupportedFormLocales} = useApp();

	const supportedFormLocales = Object.keys(getSupportedFormLocales());
	const defaultNameValues = supportedFormLocales.reduce((val, l) => {
		val[l] = '';
		return val;
	}, {});

	initEmptyForm('editContributorRole', {
		action: rolesApiUrl.value,
	});
	// Set visible locales
	form.value.visibleLocales = supportedFormLocales;

	addPage('default', {
		submitButton: {label: t('common.save')},
	});

	addGroup('default');

	addFieldSelect('identifier', {
		label: t('manager.contributorRoles.identifier'),
		isRequired: true,
		options: setIdentifierOptions(
			contributorRoleFormData.value?.identifier.options ?? [],
		),
		value: contributorRoleFormData.value?.identifier.options?.[0],
	});

	addFieldText('name', {
		label: t('manager.contributorRoles.name'),
		description: t('manager.contributorRoles.name.description'),
		isMultilingual: true,
		isRequired: true,
		value: defaultNameValues,
	});

	/**
	 * Reset form to defaults
	 */
	async function resetForm() {
		const fieldIdentifier = getField('identifier');
		fieldIdentifier.options = setIdentifierOptions(
			contributorRoleFormData.value?.identifier.options ?? [],
		);
		setValues({
			identifier: contributorRoleFormData.value?.identifier.options?.[0],
			name: defaultNameValues,
		});
	}

	return {form, resetForm};
}
