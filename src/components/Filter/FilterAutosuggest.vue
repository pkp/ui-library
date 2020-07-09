<template>
    <div class="pkpFilter--autosuggest" :class="classes">
        <component :is="component" v-bind="autosuggestProps" @change="toggle" />
    </div>
</template>

<script>
import Filter from './Filter.vue';
import FieldSelectUsers from '@/components/Form/fields/FieldSelectUsers.vue';
import FieldSelectIssues from '@/components/Form/fields/FieldSelectIssues.vue';
export default {
	extends: Filter,
	components: {
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
				this.$emit('add-filter', fieldName, this.param, newVal);
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
    padding-bottom: 1rem;
}

.pkpFormField--autosuggest__values .pkpBadge {
    margin-right: 0;
    display: block;
}
</style>
