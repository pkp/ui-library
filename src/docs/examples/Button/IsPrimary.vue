<template>
	<div>
		<pkp-button
			:label="label"
			:isPrimary="isPrimary"
		/>
	</div>
</template>

<script>
import PkpButton from '@/components/Button/Button.vue';

export default {
	name: 'isPrimary',
	components: {
		PkpButton,
	},
	data: function () {
		return {
			label: 'Submit',
			isPrimary: true,
		};
	},
};
</script>
