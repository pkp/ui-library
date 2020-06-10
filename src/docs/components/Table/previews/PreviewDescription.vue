<template>
	<pkp-table
		label="Example Table"
		description="Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
		:columns="columns"
		:rows="rows"
	/>
</template>

<script>
import PreviewTable from './PreviewTable.vue';

export default {
	extends: PreviewTable
};
</script>
