<template>
	<pkp-table
		label="Example Table"
		description="This table uses the <code>header</code> slot to customize the PDF column header."
		:columns="columns"
		:rows="rows"
	>
		<icon slot="thead-pdf" icon="exclamation-triangle" />
	</pkp-table>
</template>

<script>
import PreviewTable from './PreviewTable.vue';

export default {
	extends: PreviewTable
};
</script>
