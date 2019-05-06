<template>
	<div class="previewDateRange">
		<date-range v-bind="dateRange" @set-range="setRange" />
	</div>
</template>

<script>
import DateRange from '@/components/DateRange/DateRange.vue';
import {props} from '../config';

export default {
	components: {
		DateRange
	},
	data() {
		return {
			dateRange: {...props}
		};
	},
	methods: {
		setRange(dateStart, dateEnd) {
			this.dateRange.dateStart = dateStart;
			this.dateRange.dateEnd = dateEnd;
		}
	}
};
</script>
