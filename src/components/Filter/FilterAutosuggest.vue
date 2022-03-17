<template>
	<div class="pkpFilter--autosuggest" :class="classes">
		<component :is="component" v-bind="autosuggestProps" @change="toggle" />
	</div>
</template>

<script>
import Filter from './Filter.vue';
import FieldAutosuggestPreset from '@/components/Form/fields/FieldAutosuggestPreset.vue';
import FieldSelectUsers from '@/components/Form/fields/FieldSelectUsers.vue';
import FieldSelectIssues from '@/components/Form/fields/FieldSelectIssues.vue';
export default {
	extends: Filter,
	components: {
		FieldAutosuggestPreset,
		FieldSelectUsers,
		FieldSelectIssues
	},
	props: {
		component: {
			type: String,
			required: true
		},
		autosuggestProps: {
			type: Object,
			required: true
		}
	},
	methods: {
		toggle(fieldName, fieldProp, newVal, localeKey) {
			if (newVal.length) {
				this.$emit('add-filter', this.param, newVal);
			} else {
				this.remove();
			}
			// Update the value in the autosuggest field
			if (this.autosuggestProps.isMultilingual) {
				this.autosuggestProps[fieldProp][localeKey] = newVal;
			} else {
				this.autosuggestProps[fieldProp] = newVal;
			}
		},
		remove() {
			this.$emit('remove-filter', this.param);
		}
	}
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
