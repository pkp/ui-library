import {useFetch} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';
import {computed, watch} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import {useWorkflowStore} from '@/pages/workflow/workflowStore';
import {useForm} from '@/composables/useForm';
import {sanitizeHtml} from '@/directives/stripUnsafeHtml';

export async function useWorkflowPublicationFormIssue(form) {
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

		// If no form value yet, try to get from store (for modal context)
		if (!currentValue && assignmentStatus.value?.assignmentType) {
			currentValue = assignmentStatus.value.assignmentType;
		}

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
			label: sanitizeHtml(issue.identification),
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
	 * Create all required fields
	 */
	function createFields() {
		const initialAssignment = assignmentStatus.value?.assignmentType || null;
		const initialStatus =
			assignmentStatus.value?.status || pkp.const.submission.STATUS_QUEUED;

		addFieldOptions('assignment', 'radio', {
			label: t('publication.assignToIssue.assignmentType'),
			options: assignmentOptions.value,
			isRequired: true,
			value: initialAssignment,
		});

		addFieldSelect('issueId', {
			label: t('issue.issue'),
			description: t('publication.assignToIssue.issueDescription'),
			options: issueOptions.value,
			size: 'large',
			value: store.selectedPublication?.issueId,
			isRequired: true,
			showWhen: ['assignment', showWhenAssignmentIds.value],
		});

		setHiddenValue('status', initialStatus);
	}

	/**
	 * Set up watchers for dynamic updates and validation
	 */
	function setupWatchers() {
		// Watch assignment options changes and apply to form
		watch(assignmentOptions, (newOptions) => {
			const assignmentField = getField('assignment');
			if (assignmentField) {
				assignmentField.options = newOptions;
			}
		});

		// Watch showWhen changes and apply to issue field
		watch(showWhenAssignmentIds, (newShowWhenIds) => {
			const issueIdField = getField('issueId');
			if (issueIdField) {
				issueIdField.showWhen = ['assignment', newShowWhenIds];
			}
		});

		// Watch current assignment option changes and update status
		watch(currentAssignmentOption, async (newOption) => {
			if (newOption) {
				setHiddenValue('status', newOption.status);
				setValue('issueId', null);
				if (newOption.isPublished !== null) {
					await fetchIssues();
				}
			}
		});

		// Watch issue options and apply to form
		watch(issueOptions, (newIssueOptions) => {
			const issueIdField = getField('issueId');
			if (issueIdField) {
				issueIdField.options = newIssueOptions;
				issueIdField.isRequired = newIssueOptions.length > 0;
			}
		});
	}

	/**
	 * Initialize the composable - fetch data, create fields, and set up watchers
	 */
	async function initialize() {
		await fetchAssignments();
		await fetchAssignmentStatus();
		await fetchIssues();

		const fieldsExist = await checkFieldsExist();
		if (!fieldsExist) {
			createFields();
		}

		setupWatchers();
	}

	await initialize();
}
