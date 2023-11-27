<template>
	<TableCell
		:id="'submission-title-' + submission.id"
		class="submissions__list__item__title"
		:is-row-header="true"
	>
		<span class="submissions__list__item__author">
			{{ submission.publications[0].authorsStringShort }}
		</span>
		<template v-if="submission.publications[0].authorsStringShort">—</template>
		<!-- FIXME replace with the localized value -->
		{{ submission.publications[0].fullTitle.en }}
	</TableCell>
</template>
<script>
import TableCell from '@/components/TableNext/TableCell.vue';

export default {
	components: {
		TableCell,
	},
	props: {
		submission: Object,
	},
};
</script>
