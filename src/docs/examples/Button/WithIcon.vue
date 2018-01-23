<template>
	<div>
		<pkp-button
			:label="label"
			:icon="icon"
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
			label: 'Filters',
			icon: 'filter',
		};
	},
};
</script>
