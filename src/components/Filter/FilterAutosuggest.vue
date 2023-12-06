<template>
	<div class="pkpFilter--autosuggest" :class="classes">
		<component :is="component" v-bind="autosuggest" @change="changeSelection" />
	</div>
</template>

<script>
import Filter from './Filter.vue';
import FieldAutosuggestPreset from '@/components/Form/fields/FieldAutosuggestPreset.vue';
import FieldSelectUsers from '@/components/Form/fields/FieldSelectUsers.vue';
import FieldSelectIssues from '@/components/Form/fields/FieldSelectIssues.vue';
export default {
	components: {
		FieldAutosuggestPreset,
		FieldSelectUsers,
		FieldSelectIssues,
	},
	extends: Filter,
	props: {
		/**  */
		component: {
			type: String,
			required: true,
		},
		/** Props to be passed to the `FieldAutosuggest` component.  */
		autosuggestProps: {
			type: Object,
			required: true,
		},
	},
	emits: [
		/** Emitted when the filter is activated. Payload: `(param, value)` */
		'add-filter',
		/** Emitted when the filter is deactivated. Payload: `(param, value)` */
		'remove-filter',
	],
	data() {
		return {
			currentValue: this.value,
			currentSelected: this.autosuggestProps.selected,
		};
	},
	computed: {
		autosuggest() {
			return {
				...this.autosuggestProps,
				value: this.currentValue,
				selected: this.currentSelected,
			};
		},
	},
	watch: {
		currentValue(newVal, oldVal) {
			if (newVal.length) {
				this.$emit('add-filter', this.param, newVal);
			} else {
				this.$emit('remove-filter', this.param);
			}
		},
	},
	methods: {
		changeSelection(fieldName, fieldProp, newVal, localeKey) {
			if (fieldProp === 'value') {
				this.currentValue = newVal;
			} else if (fieldProp === 'selected') {
				this.currentSelected = newVal;
			}
		},
	},
};
</script>

<style lang="less">
@import '../../styles/_import';
.pkpFilter--autosuggest {
	position: relative;
	padding-left: 1rem;
	padding-right: 1rem;

	// Scale input field down to match size of filters
	.pkpAutosuggest__autosuggester {
		line-height: 1.25rem;
	}
}
</style>
