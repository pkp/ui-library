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
			<!-- Assignment type radio buttons -->
			<FieldOptions
				:name="props.name + '_assignment'"
				:label="t('publication.assignToIssue.description')"
				:is-required="false"
				:value="assignmentType"
				:options="assignmentOptions"
				type="radio"
				:all-errors="{}"
				:is-loading="isLoadingAssignmentOptions"
				@change="onAssignmentChange"
			/>

			<!-- Issue dropdown (only shown when assignment type requires issue selection) -->
			<div v-if="showIssueDropdown" class="pkpFormField__issueDropdown">
				<FieldSelect
					:name="props.name + '_issue'"
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
	isRequired: {
		type: Boolean,
		default: false,
	},
	errors: {
		type: Array,
		default: () => [],
	},
	value: {
		type: Object,
		default: () => ({
			assignmentType: 4, // 4 = CURRENT_BACK_ISSUES_PUBLISHED
			issueId: null,
			publicationStatus: null,
		}),
	},
	issueCount: {
		type: Number,
		default: 0,
	},
	allErrors: {
		type: Object,
		default: () => ({}),
	},
});

const emit = defineEmits(['change']);
const {t} = useLocalize();

const assignmentType = ref(props.value?.assignmentType || 4); // 4 = CURRENT_BACK_ISSUES_PUBLISHED
const selectedIssueId = ref(props.value?.issueId || null);
const availableIssues = ref([]);
const isLoadingIssues = ref(false);

const assignmentOptions = ref([]);
const isLoadingAssignmentOptions = ref(false);

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
				value: option.value, // Use enum value (1, 2, 3, 4) directly
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

const showIssueDropdown = computed(() => {
	const option = assignmentOptions.value.find(
		(opt) => opt.value === assignmentType.value,
	);
	return option?.isPublished !== null;
});

const shouldFetchPublishedIssues = computed(() => {
	const option = assignmentOptions.value.find(
		(opt) => opt.value === assignmentType.value,
	);
	return option?.isPublished;
});

const publicationStatus = computed(() => {
	const option = assignmentOptions.value.find(
		(opt) => opt.value === assignmentType.value,
	);
	return option?.status;
});

const isValid = computed(() => {
	const option = assignmentOptions.value.find(
		(opt) => opt.value === assignmentType.value,
	);
	return option?.isPublished === null || selectedIssueId.value;
});

const validationErrors = computed(() => {
	if (props.isRequired && !isValid.value) {
		return [t('publication.assignToIssue.validation.issueRequired')];
	}
	return [];
});

const describedByErrorId = computed(() => {
	return `${useId()}-error`;
});

const onAssignmentChange = (fieldName, propName, newValue) => {
	assignmentType.value = newValue;
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
	const value = {
		assignmentType: assignmentType.value,
		issueId: selectedIssueId.value,
		publicationStatus: publicationStatus.value,
	};

	// TODO: Remove this after testing
	console.log('FieldIssueSelection emitting:', {
		name: props.name,
		formId: props.formId,
		value: value,
		assignmentType: assignmentType.value,
		selectedIssueId: selectedIssueId.value,
		publicationStatus: publicationStatus.value,
	});

	emit('change', props.name, 'value', value);
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

watch(assignmentType, (newType) => {
	selectedIssueId.value = null;
	availableIssues.value = [];

	if (showIssueDropdown.value) {
		fetchIssues();
	}

	emitValue();
});

watch(selectedIssueId, () => {
	emitValue();
});

// Watch for props.value changes to sync local state
watch(
	() => props.value,
	(newValue) => {
		if (newValue) {
			assignmentType.value = newValue.assignmentType || 4; // 4 = CURRENT_BACK_ISSUES_PUBLISHED
			selectedIssueId.value = newValue.issueId || null;
		}
	},
	{deep: true},
);

onMounted(async () => {
	await fetchAssignmentOptions();
	emitValue();

	if (showIssueDropdown.value) {
		fetchIssues();
	}
});
</script>
