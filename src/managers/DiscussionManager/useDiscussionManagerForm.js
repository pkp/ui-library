import {useForm} from '@/composables/useForm';
import {useLocalize} from '@/composables/useLocalize';

export function useDiscussionManagerForm(
	status = 'New',
	closeDialog = () => {},
	onSubmitFn = null,
) {
	const {t} = useLocalize();

	function getBadgeProps() {
		let badgeProps = {};
		switch (status) {
			case 'Pending':
				badgeProps = {
					slot: t('common.yetToBegin'),
					icon: 'New',
					isPrimary: true,
				};
				break;
			case 'In Progress':
				badgeProps = {
					slot: t('common.inProgress'),
					icon: 'InProgress',
					isPrimary: true,
				};
				break;
			case 'Overdue':
				badgeProps = {
					slot: t('common.overdue'),
					icon: 'InProgress',
					isWarnable: true,
				};
				break;
			case 'Closed':
				badgeProps = {
					slot: t('common.closed'),
					icon: 'Complete',
					isSuccess: true,
				};
				break;
			default:
				badgeProps = {
					slot: t('common.new'),
					icon: 'New',
					colorVariant: 'stage-in-review-bg',
				};
		}

		return badgeProps;
	}

	async function handleFormSubmission(formData) {
		// return result to Form component handler
		return {
			data: {},
			validationError: {},
		};
	}

	const {form, initEmptyForm, addPage, addGroup, set} = useForm(
		{},
		{customSubmit: handleFormSubmission},
	);

	initEmptyForm('version', {
		showErrorFooter: false,
		spacingVariant: 'fullWidth',
	});
	addPage('default', {
		submitButton: {label: t('common.save')},
		cancelButton: {label: t('common.cancel')},
	});
	addGroup('default');

	const badgeProps = getBadgeProps(status);

	return {
		form,
		set,
		badgeProps,
	};
}
