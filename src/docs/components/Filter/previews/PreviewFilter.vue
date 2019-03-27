<template>
	<div class="previewFilters">
		<pkp-filter
			:isFilterActive="isFilterActive('stageIds', 1)"
			param="stageIds"
			title="Submission"
			:value="1"
			@add-filter="addFilter"
			@remove-filter="removeFilter"
		/>
		<pkp-filter
			:isFilterActive="isFilterActive('stageIds', 2)"
			param="stageIds"
			title="Review"
			:value="2"
			@add-filter="addFilter"
			@remove-filter="removeFilter"
		/>
		<pkp-filter
			:isFilterActive="isFilterActive('stageIds', 3)"
			param="stageIds"
			title="Copyeding"
			:value="3"
			@add-filter="addFilter"
			@remove-filter="removeFilter"
		/>
		<pkp-filter
			:isFilterActive="isFilterActive('stageIds', 4)"
			param="stageIds"
			title="Production"
			:value="4"
			@add-filter="addFilter"
			@remove-filter="removeFilter"
		/>
	</div>
</template>

<script>
import PkpFilter from '@/components/Filter/Filter.vue';
import {props} from '../config';

export default {
	components: {
		PkpFilter
	},
	data() {
		return {
			activeFilters: {
				stageIds: []
			},
			i18n: {...props.i18n}
		};
	},
	methods: {
		isFilterActive(param, val) {
			return this.activeFilters[param].includes(val);
		},
		addFilter(param, val) {
			if (!this.activeFilters[param].includes(val)) {
				this.activeFilters[param].push(val);
			}
		},
		removeFilter(param, val) {
			if (this.activeFilters[param].includes(val)) {
				this.activeFilters[param] = this.activeFilters[param].filter(
					item => item !== val
				);
			}
		}
	}
};
</script>
