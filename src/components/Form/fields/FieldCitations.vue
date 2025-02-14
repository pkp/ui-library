<template>
	<div class="pkpFormField pkpFormField--citations">
		<div class="pkpFormField__heading">
			<label class="pkpFormFieldLabel">
				user.citations
			</label>
		</div>
		<div class="pkpFormField__description">
			user.citations.description
		</div>
		<div class="pkpFormField__control pkpFormField--affiliations__control">
			Structured Citations
		</div>
	</div>
</template>

<script setup>
import {ref, computed, onMounted, watch, onBeforeUnmount} from 'vue';

/** Define component props */
const props = defineProps({
	/** Field key used for form submission */
	name: {
		type: String,
		default: null,
	},
	/** Current value of the field */
	value: {
		type: Array,
		default: () => [],
	},
	/** Default locale of the form */
	primaryLocale: {
		type: String,
		default: 'en',
	},
	/** Locale key for multilingual support */
	localeKey: {
		type: String,
		default: '',
	},
	/** List of supported locales */
	locales: {
		type: Array,
		default: () => [],
	},
	/** Object containing all form errors */
	allErrors: {
		type: Object,
		default() {
			return {};
		},
	},
	/** Indicates if the field supports multiple languages */
	isMultilingual: {
		type: Boolean,
		default: true,
	},
});

/** Emits component events */
const emit = defineEmits(['change', 'set-errors']);

/** Stores the primary locale of the form */
const primaryLocale = props.primaryLocale;

/** Stores the list of supported locales */
const locales = props.locales;

/** Current value of the field, with a setter to emit changes */
const currentValue = computed({
	get: () => props.value,
	set: (newVal) => emit('change', props.name, 'value', newVal),
});

/** Keys of supported locales */
const supportedFormLocaleKeys = props.locales.map((language) => language.key);

/** Default locale for the application */
const defaultLocale = 'en';

/** Computed property to determine error messages for the field */
computed(() => {
	if (!Object.keys(props.allErrors).includes(props.name)) {
		return [];
	}
	let errors = props.allErrors[props.name];
	if (props.isMultilingual && Object.keys(errors).includes(props.localeKey)) {
		return errors[props.localeKey];
	} else if (!props.isMultilingual) {
		return errors;
	}
	return [];
});
</script>

<style lang="less">
@import '../../../styles/_import';
</style>
