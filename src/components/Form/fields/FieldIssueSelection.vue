<template>
	<div
		:id="`${props.formId}-${props.name}`"
		class="pkpFormField pkpFormField--issueSelection"
	>
		<div class="pkpFormField__heading">
			<FormFieldLabel
				:control-id="useId()"
				:label="t('publication.assignToIssue.label')"
				:is-required="isRequired"
				:required-label="t('common.required')"
				class="align-middle"
			/>
		</div>
		<div
			v-strip-unsafe-html="t('publication.assignToIssue.description')"
			class="pkpFormField__description semantic-defaults"
		/>
		<div class="pkpFormField__control">
			<FieldOptions
				:name="props.name + '_assignment'"
				:label="t('publication.assignToIssue.description')"
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
					:is-required="isRequired"
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
	</div>
</template>

<script setup>
import {ref, computed, watch, onMounted, useId} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import {useFetch} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';
import FormFieldLabel from '@/components/Form/FormFieldLabel.vue';
import FieldError from '@/components/Form/FieldError.vue';
import FieldOptions from '@/components/Form/fields/FieldOptions.vue';
import FieldSelect from '@/components/Form/fields/FieldSelect.vue';

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
	allErrors: {
		type: Object,
		default: () => ({}),
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
		default: false,
	},
	isPhpForm: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(['change', 'set-errors', 'set']);
const {t} = useLocalize();

// Local state - track user selections
const availableIssues = ref([]);
const isLoadingIssues = ref(false);

// User selections - these are what the user has actually chosen
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
	// Skip if there is a preset assignment type
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
	// Don't show dropdown if no assignment options are loaded yet
	if (assignmentOptions.value.length === 0) {
		return false;
	}

	const option = assignmentOptions.value.find(
		(opt) => opt.value === selectedAssignmentType.value,
	);
	return option?.isPublished !== null;
});

const shouldFetchPublishedIssues = computed(() => {
	const option = assignmentOptions.value.find(
		(opt) => opt.value === selectedAssignmentType.value,
	);
	return option?.isPublished;
});

const isValid = computed(() => {
	const option = assignmentOptions.value.find(
		(opt) => opt.value === selectedAssignmentType.value, // Use user's selection
	);
	return option?.isPublished === null || selectedIssueId.value; // Use user's issue selection
});

const publicationStatus = computed(() => {
	const option = assignmentOptions.value.find(
		(opt) => opt.value === selectedAssignmentType.value,
	);
	return option?.status || null;
});

const validationErrors = computed(() => {
	if (!isValid.value) {
		return [t('publication.assignToIssue.validation.issueRequired')];
	}
	return [];
});

// Emit validation errors to the form system
watch(
	validationErrors,
	(errors) => {
		if (errors.length > 0) {
			emit('set-errors', props.name, errors);
		} else {
			emit('set-errors', props.name, []);
		}
	},
	{immediate: true},
);

const describedByErrorId = computed(() => {
	return `${useId()}-error`;
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
			assignmentType: selectedAssignmentType.value, // User's assignment type selection
			issueId: selectedIssueId.value, // User's issue selection
			publicationStatus: publicationStatus.value, // Calculated status from user's selection
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

onMounted(async () => {
	// Initialize user selections with props or publication values
	selectedAssignmentType.value = props.assignmentType || null;
	selectedIssueId.value = props.publication?.issueId || null;

	await Promise.all([fetchAssignmentOptions(), fetchAssignmentType()]);

	// Debug: Log the state after fetching
	// console.log('FieldIssueSelection mounted:', {
	// 	selectedAssignmentType: selectedAssignmentType.value,
	// 	selectedIssueId: selectedIssueId.value,
	// 	showIssueDropdown: showIssueDropdown.value,
	// 	assignmentOptions: assignmentOptions.value,
	// 	issueCount: props.issueCount
	// });

	// If we have an assignment type that requires issue selection and an existing issue ID,
	// fetch the issues so the dropdown is populated and the correct issue is pre-selected
	if (
		selectedAssignmentType.value &&
		selectedIssueId.value &&
		showIssueDropdown.value
	) {
		await fetchIssues();
	}

	// TODO : remove this once the emit issue for hidden field is fixed
	if (props.isPhpForm) {
		$('input[name="prePublishStatus"]').hide();
	}

	emitValue();
});
</script>
