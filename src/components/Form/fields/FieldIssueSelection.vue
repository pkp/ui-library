<template>
	<div
		:id="`${props.formId}-${props.name}`"
		class="pkpFormField pkpFormField--issueSelection"
	>
		<fieldset class="pkpFormGroup pkpFormGroup--issueSelection">
			<div class="pkpFormGroup__heading">
				<FormGroupHeader
					:label="
						t('publication.assignToIssue.label') + (isRequired ? ' *' : '')
					"
					:description="
						t('publication.assignToIssue.assignmentTypeDescription')
					"
				/>
			</div>
			<div class="pkpFormGroup__fields">
				<FieldOptions
					:name="props.name + '_assignment'"
					:label="t('publication.assignToIssue.assignmentType')"
					:is-required="false"
					:value="finalAssignmentType"
					:options="assignmentOptions"
					type="radio"
					:all-errors="{}"
					:is-loading="isLoadingAssignmentOptions"
					@change="onAssignmentChange"
				/>

				<div v-if="showIssueDropdown" class="pkpFormField__issueDropdown">
					<FieldSelect
						:name="props.name"
						:label="t('issue.issue')"
						:description="t('publication.assignToIssue.issueDescription')"
						:is-required="isIssueSelectionRequired"
						:value="selectedIssueId"
						:options="availableIssues"
						:all-errors="{}"
						size="large"
						@change="onIssueChange"
					/>
				</div>

				<FieldError
					v-if="(errors && errors.length) || validationErrors.length"
					:id="describedByErrorId"
					:messages="errors && errors.length ? errors : validationErrors"
				/>
			</div>
		</fieldset>
	</div>
</template>

<script setup>
import {ref, computed, watch, onMounted} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import {useFetch} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';
import FieldError from '@/components/Form/FieldError.vue';
import FieldOptions from '@/components/Form/fields/FieldOptions.vue';
import FieldSelect from '@/components/Form/fields/FieldSelect.vue';
import FormGroupHeader from '@/components/Form/FormGroupHeader.vue';

const props = defineProps({
	name: {
		type: String,
		required: true,
	},
	formId: {
		type: String,
		default: null,
	},
	errors: {
		type: Array,
		default: () => [],
	},
	assignmentType: {
		type: Number,
		default: null,
	},
	issueCount: {
		type: Number,
		default: 0,
	},
	publication: {
		type: Object,
		required: true,
	},
	isRequired: {
		type: Boolean,
		default: true,
	},
	isPhpForm: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(['change', 'set-errors', 'set']);
const {t} = useLocalize();

const availableIssues = ref([]);
const isLoadingIssues = ref(false);

const selectedIssueId = ref(props.publication?.issueId || null);
const selectedAssignmentType = ref(props.assignmentType || null);

const fetchedAssignmentType = ref(null);
const assignmentOptions = ref([]);
const isLoadingAssignmentOptions = ref(false);

// Computed final assignment type with fallback (only for initial/default values)
const finalAssignmentType = computed(() => {
	return (
		selectedAssignmentType.value ||
		fetchedAssignmentType.value ||
		pkp.const.ISSUE_ASSIGNMENT_DEFAULT
	);
});

const fetchAssignmentOptions = async () => {
	if (isLoadingAssignmentOptions.value) {
		return;
	}

	isLoadingAssignmentOptions.value = true;

	try {
		const {apiUrl} = useUrl('issues/assignmentOptions');
		const {fetch, data} = useFetch(apiUrl);
		await fetch();

		if (data.value) {
			const options = data.value.map((option) => ({
				value: option.value,
				label: option.label,
				status: option.status,
				isPublished: option.isPublished,
			}));

			// Only show assignment options if there are issues available
			assignmentOptions.value = props.issueCount > 0 ? options : [options[0]];
		}
	} catch (error) {
		console.error('Error fetching assignment options:', error);
	} finally {
		isLoadingAssignmentOptions.value = false;
	}
};

const fetchAssignmentType = async () => {
	// will not fetch if the assignment type is give for the publication
	// for example, it's can be given from the PHP form
	if (props.assignmentType !== null) {
		return;
	}

	try {
		const {apiUrl} = useUrl(
			`submissions/${props.publication.submissionId}/publications/${props.publication.id}/issueAssignmentStatus`,
		);
		const {fetch, data} = useFetch(apiUrl);
		await fetch();

		if (data.value?.assignmentType) {
			fetchedAssignmentType.value = data.value.assignmentType;
			selectedAssignmentType.value = data.value.assignmentType;
		}
	} catch (error) {
		console.error('Error fetching assignment type:', error);
		selectedAssignmentType.value = pkp.const.ISSUE_ASSIGNMENT_DEFAULT; // Fallback to default
	}
};

const showIssueDropdown = computed(() => {
	// no dropdown if no assignment options available
	if (assignmentOptions.value.length === 0) {
		return false;
	}

	const option = assignmentOptions.value.find(
		(opt) => opt.value === selectedAssignmentType.value,
	);
	return option?.isPublished !== null;
});

// TODO : need it ?
// dynamic isRequired based on selection and props.isRequired
const isIssueSelectionRequired = computed(() => {
	// Only require issue selection if:
	// 1. The field is marked as required (from PHP or JS)
	// 2. AND the selected assignment type actually requires an issue (isPublished !== null)
	const selectedOption = assignmentOptions.value.find(
		(opt) => opt.value === selectedAssignmentType.value,
	);

	return props.isRequired && selectedOption?.isPublished !== null;
});

const shouldFetchPublishedIssues = computed(() => {
	const option = assignmentOptions.value.find(
		(opt) => opt.value === selectedAssignmentType.value,
	);
	return option?.isPublished;
});

// TODO : need this ?
// better validation logic
const isValid = computed(() => {
	// If no assignment type selected, not valid
	if (!selectedAssignmentType.value) {
		return false;
	}

	const option = assignmentOptions.value.find(
		(opt) => opt.value === selectedAssignmentType.value,
	);

	// If assignment type doesn't require issue selection, always valid
	if (option?.isPublished === null) {
		return true;
	}

	// If assignment type requires issue selection, check if issue is selected
	return selectedIssueId.value !== null;
});

const publicationStatus = computed(() => {
	const option = assignmentOptions.value.find(
		(opt) => opt.value === selectedAssignmentType.value,
	);
	return option?.status || null;
});

// TODO : need this ?
// validation error messages
const validationErrors = computed(() => {
	if (!isValid.value) {
		// If assignment type requires issue but none selected
		if (isIssueSelectionRequired.value && !selectedIssueId.value) {
			return [t('publication.assignToIssue.validation.issueRequired')];
		}
		// If no assignment type selected
		if (!selectedAssignmentType.value) {
			return [t('publication.assignToIssue.validation.assignmentRequired')];
		}
	}
	return [];
});

watch(
	validationErrors,
	(errors) => {
		errors.length > 0
			? emit('set-errors', props.name, errors) // emit errors
			: emit('set-errors', props.name, []); // clear errors
	},
	{immediate: true},
);

// Watch for assignment type changes to update validation
watch(
	selectedAssignmentType,
	() => {
		// Trigger validation update when assignment type changes
		// This ensures validationErrors computed property updates
	},
	{immediate: true},
);

const describedByErrorId = computed(() => {
	return `${props.formId || 'form'}-${props.name}-error`;
});

const onAssignmentChange = (fieldName, propName, newValue) => {
	selectedAssignmentType.value = newValue;
	selectedIssueId.value = null;
	availableIssues.value = [];

	if (showIssueDropdown.value) {
		fetchIssues();
	}

	emitValue();
};

const onIssueChange = (fieldName, propName, newValue) => {
	selectedIssueId.value = newValue;
	emitValue();
};

const emitValue = () => {
	if (props.isPhpForm) {
		if (assignmentOptions.value.length > 0) {
			// TODO: Remove this after testing
			// console.log('PHP Form - Emitting issueId, updating hiddenFields:', {
			// 	issueId: selectedIssueId.value, // User's issue selection
			// 	assignmentType: selectedAssignmentType.value, // User's assignment type selection
			// 	publicationStatus: publicationStatus.value, // Calculated status from user's selection
			// });

			emit('change', 'issueId', 'value', selectedIssueId.value);
			emit('change', 'prePublishStatus', 'value', publicationStatus.value);
		}
	} else {
		const value = {
			assignmentType: selectedAssignmentType.value,
			issueId: selectedIssueId.value,
			publicationStatus: publicationStatus.value,
			isValid: isValid.value,
		};

		// TODO: Remove this after testing
		// console.log('Vue Form - FieldIssueSelection emitting:', {
		// 	name: props.name,
		// 	formId: props.formId,
		// 	value: value,
		// 	assignmentType: selectedAssignmentType.value, // User's selection
		// 	selectedIssueId: selectedIssueId.value, // User's selection
		// 	publicationStatus: publicationStatus.value, // Calculated status
		// });

		emit('change', props.name, 'value', value);
	}
};

const fetchIssues = async () => {
	if (shouldFetchPublishedIssues.value === null) {
		return;
	}

	if (isLoadingIssues.value) {
		return;
	}

	isLoadingIssues.value = true;

	try {
		const {apiUrl} = useUrl('issues');
		const {fetch, data} = useFetch(apiUrl, {
			params: {
				isPublished: shouldFetchPublishedIssues.value,
				count: 100,
			},
		});

		await fetch();
		const issues = data.value?.items || [];

		availableIssues.value = formatIssuesForDropdown(issues);
	} catch (error) {
		console.error('Error fetching issues:', error);
		availableIssues.value = [];
	} finally {
		isLoadingIssues.value = false;
	}
};

const formatIssuesForDropdown = (issues) => {
	return issues.map((issue) => ({
		id: issue.id,
		label: issue.identification,
		value: issue.id,
	}));
};

watch(selectedAssignmentType, (newType) => {
	selectedIssueId.value = null;
	availableIssues.value = [];

	if (showIssueDropdown.value) {
		fetchIssues();
	}

	// Small delay to ensure the dropdown visibility is updated
	setTimeout(() => {
		emitValue();
	}, 100);
});

watch(selectedIssueId, () => {
	emitValue();
});

// Watch for changes and emit required state
watch(
	[selectedAssignmentType, selectedIssueId],
	() => {
		// Determine if field is currently required
		let isCurrentlyRequired = true; // Default to required

		if (selectedAssignmentType.value) {
			const selectedOption = assignmentOptions.value.find(
				(opt) => opt.value === selectedAssignmentType.value,
			);

			// If assignment type doesn't require issue selection, not required
			if (selectedOption?.isPublished === null) {
				isCurrentlyRequired = false;
			}
		}

		// Emit the current required state
		emit('set-field-required', props.name, isCurrentlyRequired);

		emitValue(); // emit the value change
	},
	{immediate: false}, // not run immediately since we handle it in onMounted
);

// ✅ NEW: Function to emit initial required state
const emitInitialRequiredState = () => {
	// Determine if field is currently required based on initial values
	let isCurrentlyRequired = true; // Default to required

	if (selectedAssignmentType.value) {
		const selectedOption = assignmentOptions.value.find(
			(opt) => opt.value === selectedAssignmentType.value,
		);

		// If assignment type doesn't require issue selection, not required
		if (selectedOption?.isPublished === null) {
			isCurrentlyRequired = false;
		}
	}

	// Emit the initial required state
	emit('set-field-required', props.name, isCurrentlyRequired);
};

onMounted(async () => {
	selectedAssignmentType.value = props.assignmentType || null;

	await Promise.all([fetchAssignmentOptions(), fetchAssignmentType()]);

	// Need to set the selected issue id after the fetch of assignment type as
	// the watcher of selected assignment type does update the `selectedIssueId`
	selectedIssueId.value = props.publication?.issueId || null;

	// already pre-existed assignment type that requires issue selection and an existing issue ID,
	// fetch the issues so the dropdown is populated and the correct issue is pre-selected
	if (selectedAssignmentType.value && showIssueDropdown.value) {
		await fetchIssues();
	}

	emitValue();

	emitInitialRequiredState();
});
</script>

<style lang="less" scoped>
.pkpFormGroup--issueSelection {
	border: 1px solid #ddd;
	border-radius: 2px;

	.pkpFormGroup__heading {
		border-bottom: 1px solid #ddd;
		margin: -2rem 0rem 2rem 0rem;
		padding: 1.5rem 0rem 2rem 0rem;
		border-radius: 4px 4px 0 0;
		float: none;
		width: 100%;
		padding-inline-end: 2rem;
	}

	.pkpFormGroup__fields {
		float: none;
		width: 100%;
		padding-inline-start: 0;

		> * + * {
			margin-top: 1.5rem;
		}
	}

	.pkpFormField__issueDropdown {
		padding-top: 1rem;
		margin-top: 1.5rem;
	}
}
</style>
