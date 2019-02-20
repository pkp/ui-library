<template>
	<div>
		<pkp-button
			:label="label"
			disabled="disabled"
		/>
	</div>
</template>

<script>
import PkpButton from '@/components/Button/Button.vue';

export default {
	name: 'isDisabled',
	components: {
		PkpButton,
	},
	data: function () {
		return {
			label: 'Delete',
		};
	},
};
</script>
