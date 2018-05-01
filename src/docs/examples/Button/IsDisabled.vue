<template>
	<div>
		<pkp-button
			:label="label"
			:disabled="isDisabled"
		/>
	</div>
</template>

<script>
import PkpButton from '@/components/Button/Button.vue';

export default {
	name: 'IsDisabled',
	components: {
		PkpButton,
	},
	data: function () {
		return {
			label: 'Merge User',
			isDisabled: true,
		};
	},
};
</script>
