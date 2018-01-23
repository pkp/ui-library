<template>
	<div>
		<pkp-button
			:label="label"
			:isWarnable="isWarnable"
		/>
	</div>
</template>

<script>
import PkpButton from '@/components/Button/Button.vue';

export default {
	name: 'IsWarnable',
	components: {
		PkpButton,
	},
	data: function () {
		return {
			label: 'Delete',
			isWarnable: true,
		};
	},
};
</script>
