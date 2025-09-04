import {useFetch} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';
import {computed, watch} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import {useWorkflowStore} from '@/pages/workflow/workflowStore';
import {useForm} from '@/composables/useForm';

export function useWorkflowPublicationFormIssue(form) {
	const {t} = useLocalize();
	const store = useWorkflowStore();
	const {
		setHiddenValue,
		getHiddenValue,
		getField,
		addFieldOptions,
		addFieldSelect,
		setValue,
	} = useForm(form);

	const {apiUrl: assignmentsUrl} = useUrl('issues/assignmentOptions');
	const {fetch: fetchAssignments, data: assignments} = useFetch(assignmentsUrl);

	const {apiUrl: assignmentStatusUrl} = useUrl(
		`submissions/${store.submission.id}/publications/${store.selectedPublication.id}/issueAssignmentStatus`,
	);
	const {fetch: fetchAssignmentStatus, data: assignmentStatus} =
		useFetch(assignmentStatusUrl);

	const assignmentOptions = computed(() => {
		if (!assignments.value) return [];
		return assignments.value.map((option) => ({
			value: option.value,
			label: option.label,
			status: option.status,
			isPublished: option.isPublished,
		}));
	});

	const showWhenAssignmentIds = computed(() => {
		if (!assignments.value) return [];
		return assignments.value
			.filter((option) => option.isPublished !== null)
			.map((option) => option.value);
	});

	const currentAssignmentOption = computed(() => {
		if (!assignments.value || assignments.value.length === 0) {
			return null;
		}

		let currentValue = getField('assignment')?.value;

		if (!currentValue) {
			return null;
		}

		return assignments.value.find((option) => option.value === currentValue);
	});

	const {apiUrl: issuesUrl} = useUrl('issues');
	const issuesQuery = computed(() => {
		// Only fetch issues if we have a valid assignment option
		if (
			!currentAssignmentOption.value ||
			currentAssignmentOption.value.isPublished === null
		) {
			return null;
		}
		return {
			isPublished: currentAssignmentOption.value.isPublished,
			count: 100,
		};
	});
	const {fetch: fetchIssues, data: issues} = useFetch(issuesUrl, {
		query: issuesQuery,
	});

	const issueOptions = computed(() => {
		if (
			!currentAssignmentOption.value ||
			currentAssignmentOption.value.isPublished === null
		) {
			return [];
		}

		if (!issues.value || !issues.value.items) {
			return [];
		}

		return issues.value.items.map((issue) => ({
			value: issue.id,
			label: issue.identification,
		}));
	});

	/**
	 * Check if the required fields already exist in the form
	 */
	async function checkFieldsExist() {
		if (!getField || !getHiddenValue) {
			return false;
		}

		const issueIdField = getField('issueId');
		const assignmentField = getField('assignment');
		const statusValue = getHiddenValue('status');

		return (
			issueIdField &&
			assignmentField &&
			statusValue !== null &&
			statusValue !== undefined
		);
	}

	/**
	 * Create fields immediately with placeholder data for instant UI rendering
	 */
	function createFields() {
		addFieldOptions('assignment', 'radio', {
			label: t('publication.assignToIssue.assignmentType'),
			options: [],
			isRequired: true,
			value: null,
		});

		addFieldSelect('issueId', {
			label: t('issue.issue'),
			description: t('publication.assignToIssue.issueDescription'),
			options: [],
			size: 'large',
			value: store.selectedPublication?.issueId,
			isRequired: true,
			showWhen: ['assignment', []],
		});

		// Set initial status - will be updated by watchers when assignmentStatus data arrives
		setHiddenValue('status', store.selectedPublication?.status);
	}

	/**
	 * Set up watchers to handle data updates and field synchronization
	 */
	function setupDataWatchers() {
		// Track if this is the initial data load to preserve existing issueId values
		let isInitialDataLoad = true;

		// Watch assignmentStatus and update initial assignment value
		watch(
			assignmentStatus,
			(newStatus) => {
				if (newStatus?.assignmentType) {
					const assignmentField = getField('assignment');

					if (assignmentField && !assignmentField.value) {
						setValue('assignment', newStatus.assignmentType);
					}

					// At initial data load, if the publication is published or scheduled, don't set the new status
					if (
						![
							pkp.const.publication.STATUS_PUBLISHED,
							pkp.const.publication.STATUS_SCHEDULED,
						].includes(store.selectedPublication?.status)
					) {
						setHiddenValue('status', newStatus.status);
					}
				}
			},
			{immediate: true},
		);

		// Watch assignment options and update field options
		watch(
			assignmentOptions,
			(newOptions) => {
				const assignmentField = getField('assignment');
				if (assignmentField) {
					assignmentField.options = newOptions;
				}
			},
			{immediate: true},
		);

		// Watch showWhen changes and apply to issue field
		watch(
			showWhenAssignmentIds,
			(newShowWhenIds) => {
				const issueIdField = getField('issueId');
				if (issueIdField) {
					issueIdField.showWhen = ['assignment', newShowWhenIds];
				}
			},
			{immediate: true},
		);

		// Watch current assignment option changes and update status
		watch(currentAssignmentOption, async (newOption) => {
			if (newOption) {
				// Only reset issueId to null if this is NOT the initial data load
				// This preserves the initial issueId value from store.selectedPublication?.issueId
				// Or coming from PHP form's end
				// Also at initial data load, if the publication is published or scheduled, don't set the new status
				if (!isInitialDataLoad) {
					setValue('issueId', null);
					setHiddenValue('status', newOption.status);
				} else {
					if (
						[
							pkp.const.publication.STATUS_PUBLISHED,
							pkp.const.publication.STATUS_SCHEDULED,
						].includes(store.selectedPublication?.status)
					) {
						setHiddenValue('status', null);
					}
				}

				if (newOption.isPublished !== null) {
					await fetchIssues();
				}
			}
		});

		// Watch issue options and apply to form
		watch(
			issueOptions,
			(newIssueOptions) => {
				const issueIdField = getField('issueId');
				if (issueIdField) {
					issueIdField.options = newIssueOptions;
				}
			},
			{immediate: true},
		);

		// Mark initial data load as complete after a short delay
		// which in return all initial watchers have had a chance to run
		setTimeout(() => {
			isInitialDataLoad = false;
		}, 100);
	}

	/**
	 * Initialize the composable
	 * Create fields immediately(if not exist) and fetch data in parallel
	 */
	async function initialize() {
		const fieldsExist = await checkFieldsExist();

		if (!fieldsExist) {
			createFields();
		}

		setupDataWatchers();

		fetchAssignments();
		fetchAssignmentStatus();
	}

	return {
		initialize,
	};
}
