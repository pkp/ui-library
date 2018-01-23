<template>
	<div>
		<pkp-button
			:label="label"
			:isLink="isLink"
		/>
	</div>
</template>

<script>
import PkpButton from '@/components/Button/Button.vue';

export default {
	name: 'IsLink',
	components: {
		PkpButton,
	},
	data: function () {
		return {
			label: 'View Submission',
			isLink: true,
		};
	},
};
</script>
