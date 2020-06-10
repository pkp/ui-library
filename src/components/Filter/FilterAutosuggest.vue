<template>
	<div class="pkpFilter--autosuggest" :class="classes">
		This is a test.
		<field-select-users v-bind="autosuggestProps" @change="toggle" />
	</div>
</template>

<script>
import Filter from './Filter.vue';
import FieldSelectUsers from '@/components/Form/fields/FieldSelectUsers.vue';
export default {
	extends: Filter,
	components: {
		FieldSelectUsers
	},
	props: {
		autosuggestProps: {
			type: Object,
			required: true
		}
	},
	methods: {
		toggle() {
			if (!this.currentValue) {
				this.remove();
			} else {
				this.$emit('add-filter', this.param, this.value);
			}
		},
		remove() {
			this.$emit('remove-filter', this.param, this.value);
		}
	}
};
</script>
