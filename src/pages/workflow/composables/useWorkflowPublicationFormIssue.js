import {useFetch} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';
import {computed, watch, ref} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import {useWorkflowStore} from '@/pages/workflow/workflowStore';
import {useForm} from '@/composables/useForm';

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

	const assignmentDataRef = ref({
		assignmentOptions: [],
		currentAssignment: null,
		currentStatus: null,
		optionsWhichShowsIssues: [],
		issueOptions: [],
	});

	const assignmentOptions = computed(
		() => assignmentDataRef.value.assignmentOptions,
	);
	const currentAssignment = computed(
		() => assignmentDataRef.value.currentAssignment,
	);

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
	 * Fetch assignment data from API
	 */
	async function fetchAssignmentData() {
		try {
			// Fetch assignment options
			const {apiUrl: assignmentOptionsUrl} = useUrl('issues/assignmentOptions');
			const {fetch: fetchAssignmentOptions, data: assignmentOptionsData} =
				useFetch(assignmentOptionsUrl);
			await fetchAssignmentOptions();

			// Fetch current assignment status
			const {apiUrl: assignmentStatusUrl} = useUrl(
				`submissions/${store.submission.id}/publications/${store.selectedPublication.id}/issueAssignmentStatus`,
			);
			const {fetch: fetchAssignmentStatus, data: assignmentStatusData} =
				useFetch(assignmentStatusUrl);
			await fetchAssignmentStatus();

			const assignmentOptions =
				assignmentOptionsData.value?.map((option) => ({
					value: option.value,
					label: option.label,
					status: option.status,
					isPublished: option.isPublished,
				})) || [];

			const currentAssignment =
				assignmentStatusData.value?.assignmentType || null;
			const currentStatus = assignmentStatusData.value?.status || null;

			// Determine which options show issues
			const optionsWhichShowsIssues = assignmentOptions
				.filter((option) => option.isPublished !== null)
				.map((option) => option.value);

			// Get initial issue options if current assignment requires them
			let issueOptions = [];
			if (currentAssignment) {
				const selectedOption = assignmentOptions.find(
					(opt) => opt.value === currentAssignment,
				);
				if (selectedOption && selectedOption.isPublished !== null) {
					issueOptions = await fetchIssuesForAssignment(
						selectedOption.isPublished,
					);
				}
			}

			const data = {
				assignmentOptions,
				currentAssignment,
				currentStatus,
				optionsWhichShowsIssues,
				issueOptions,
			};

			assignmentDataRef.value = data;

			return data;
		} catch (error) {
			console.error('Error fetching assignment data:', error);
			const defaultData = {
				assignmentOptions: [],
				currentAssignment: null,
				currentStatus: null,
				optionsWhichShowsIssues: [],
				issueOptions: [],
			};
			assignmentDataRef.value = defaultData;
			return defaultData;
		}
	}

	/**
	 * Fetch issues for a specific assignment type based on isPublished status
	 */
	async function fetchIssuesForAssignment(isPublished) {
		try {
			const {apiUrl: issuesUrl} = useUrl('issues');
			const {fetch, data: issuesData} = useFetch(issuesUrl, {
				query: {
					isPublished: isPublished,
				},
			});

			await fetch();

			if (issuesData.value && issuesData.value.items) {
				const issueOptions = issuesData.value.items.map((issue) => ({
					value: issue.id,
					label: issue.identification,
				}));
				return issueOptions;
			} else {
				return [];
			}
		} catch (error) {
			console.error('Error fetching issues:', error);
			return [];
		}
	}

	/**
	 * Create all required fields
	 */
	function createFields() {
		const currentData = assignmentDataRef.value;

		addFieldOptions('assignment', 'radio', {
			label: t('publication.assignToIssue.assignmentType'),
			options: currentData.assignmentOptions || [],
			isRequired: true,
			value: currentData.currentAssignment || null,
		});

		addFieldSelect('issueId', {
			label: t('issue.issue'),
			description: t('publication.assignToIssue.issueDescription'),
			options: currentData.issueOptions || [],
			size: 'large',
			value: store.selectedPublication?.issueId,
			isRequired: false,
			showWhen: ['assignment', currentData.optionsWhichShowsIssues || []],
		});

		setHiddenValue(
			'status',
			currentData.currentStatus ?? pkp.const.submission.STATUS_QUEUED,
		);
	}

	/**
	 * Set up watchers for dynamic updates and validation
	 */
	function setupWatchers() {
		let isUpdatingIssues = false; // Flag to prevent duplicate API calls

		watch(
			currentAssignment,
			async (newAssignmentValue, oldAssignmentValue) => {
				if (!newAssignmentValue || isUpdatingIssues) {
					return;
				}

				isUpdatingIssues = true; // Set flag to prevent duplicate calls

				try {
					const selectedOption = assignmentOptions.value.find(
						(opt) => opt.value === newAssignmentValue,
					);

					if (!selectedOption) {
						return;
					}

					setHiddenValue('status', selectedOption.status);

					const issueIdField = getField('issueId');
					if (issueIdField) {
						// Validate issueId field requirement
						issueIdField.isRequired = selectedOption.isPublished !== null;

						const newIssueOptions =
							selectedOption.isPublished !== null
								? await fetchIssuesForAssignment(selectedOption.isPublished)
								: [];

						setValue('issueId', null);

						addFieldSelect(
							'issueId',
							{
								...issueIdField,
								options: newIssueOptions,
							},
							{override: true},
						);

						assignmentDataRef.value.issueOptions = newIssueOptions;
					}
				} finally {
					// Reset flag after a short delay to allow for any immediate updates
					setTimeout(() => {
						isUpdatingIssues = false;
					}, 100);
				}
			},
			{immediate: false},
		); // Don't run immediately since we may already have initial data form PHP form

		// This syncs form field changes with the reactive data
		if (getField && getField('assignment')) {
			watch(
				() => getField('assignment')?.value,
				(newValue) => {
					if (newValue !== currentAssignment.value && !isUpdatingIssues) {
						assignmentDataRef.value.currentAssignment = newValue;
					}
				},
			);
		}
	}

	/**
	 * Initialize the composable - fetch data, create fields, and set up watchers
	 */
	async function initialize() {
		await fetchAssignmentData();

		// Check if fields already exist (only if we have form methods)
		const fieldsExist = await checkFieldsExist();
		if (!fieldsExist) {
			createFields();
		}

		setupWatchers();
	}

	await initialize();
}
