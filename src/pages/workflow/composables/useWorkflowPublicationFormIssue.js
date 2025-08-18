import {useForm} from '@/composables/useForm';
import {useFetch} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';
import {watch, computed} from 'vue';
export function useWorkflowPublicationFormIssue(form) {
	const {setHiddenValue, getField, getValue, setValue} = useForm(form);

	/**
	 * Assignments & prepublication status
	 */
	const {apiUrl: assignmentsUrl} = useUrl('issues/assignmentOptions');
	const {fetch: fetchAssignments, data: assignments} = useFetch(assignmentsUrl);
	fetchAssignments();

	// Calculate list of assignment options
	const assignmentOptions = computed(() => {
		if (!form.value || !assignments.value) {
			return [];
		}
		return assignments.value.map((assignment) => ({
			label: assignment.label,
			value: assignment.value,
		}));
	});

	// Calculate which assignments should be displaying issue field
	const showWhenAssignmentIds = computed(() => {
		if (!form.value || !assignments.value) {
			return [];
		}

		return assignments.value
			.filter((assignment) => assignment.isPublished !== null)
			.map((assignment) => assignment.value);
	});

	// Currently selected assignemnt option
	const currentAssignmentOption = computed(() => {
		if (form.value && assignments.value && getField('assignment')?.value) {
			const option = assignments.value.find(
				(assignment) => assignment.value === getField('assignment')?.value,
			);
			return option;
		}
		return null;
	});

	// Apply assignmentOptions to the form when changes
	watch(assignmentOptions, (newAssignmentOptions) => {
		const assignmentField = getField('assignment');

		assignmentField.options = newAssignmentOptions;

		const optionsWhichShowsIssues = newAssignmentOptions
			.filter((option) => option.isPublished !== null)
			.map((option) => option.value);
		const issueIdField = getField('issueId');
		issueIdField.showWhen = ['assignment', optionsWhichShowsIssues];
	});

	// Update prePublishStatus
	watch(currentAssignmentOption, (newAssignmentOption) => {
		setHiddenValue('prePublishStatus', newAssignmentOption.status);
	});

	/** Issues */
	const {apiUrl: issuesUrl} = useUrl('issues');
	const issuesQuery = computed(() => ({
		isPublished: currentAssignmentOption.value.isPublished,
		count: 100,
	}));
	const {fetch: fetchIssues, data: issues} = useFetch(issuesUrl, {
		query: issuesQuery,
	});

	// fetch issues when the option changes, and isPublished is not null
	watch(currentAssignmentOption, (newCurrentAssignmentOption) => {
		if (newCurrentAssignmentOption) {
			if (newCurrentAssignmentOption.isPublished !== null) {
				fetchIssues({clearData: true});
			}
		}
	});

	// list of issue options
	const issueOptions = computed(() => {
		if (
			form.value &&
			issues.value &&
			currentAssignmentOption.value?.isPublished !== null
		) {
			return issues.value.items.map((issue) => ({
				id: issue.id,
				label: issue.identification,
				value: issue.id,
			}));
		}

		return [];
	});

	// applying issue options
	watch(issueOptions, (newIssueOptions) => {
		const issueIdField = getField('issueId');

		issueIdField.options = newIssueOptions;

		// update value if its not within options
		if (
			newIssueOptions.length &&
			!newIssueOptions.find((issue) => getValue('issueId') === issue.value)
		) {
			setValue('issueId', newIssueOptions[0].value);
		}
	});

	// applying showWhen
	watch(showWhenAssignmentIds, (newShowWhenAssignmentIds) => {
		const issueIdField = getField('issueId');

		issueIdField.showWhen = ['assignment', newShowWhenAssignmentIds];
	});
}
