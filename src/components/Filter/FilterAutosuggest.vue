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
		toggle(fieldName, fieldProp, newVal) {
			if (newVal.length) {
				this.$emit('add-filter', this.param, newVal);
			} else {
				this.remove();
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
	.pkpFormField--autosuggest__input {
		line-height: 2rem;
		height: 2rem;
	}

	// Always display values in vertical list because
	// filters are used in narrow columns
	.pkpFormField--autosuggest__values {
		display: block;

		.pkpBadge {
			margin-right: 0;
			display: block;
		}
	}
}
</style>
