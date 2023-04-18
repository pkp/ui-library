<template>
	<component
		:is="isRowHeader ? 'th' : 'td'"
		:scope="isRowHeader ? 'row' : false"
		class="pkpTableCell"
		tabindex="-1"
	>
		<slot />
	</component>
</template>

<script>
export default {
	props: {
		isRowHeader: {
			type: Boolean,
			default() {
				return false;
			},
		},
	},
};
</script>
