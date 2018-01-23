<template>
	<div>
		<pkp-button
			:label="label"
			:isActive="isActive"
		/>
	</div>
</template>

<script>
import PkpButton from '@/components/Button/Button.vue';

export default {
	name: 'IsActive',
	components: {
		PkpButton,
	},
	data: function () {
		return {
			label: 'Expand Details',
			isActive: true,
		};
	},
};
</script>
