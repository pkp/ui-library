<template>
	<multilingual-progress
		:count="count"
		:total="total"
		:i18n="i18n"
	/>
</template>

<script>
import MultilingualProgress from '@/components/MultilingualProgress/MultilingualProgress.vue';

export default {
	name: 'CompleteMultilingualProgress',
	components: {
		MultilingualProgress,
	},
	data: function () {
		return {
			count: 3,
			total: 3,
			i18n: {
				multilingualProgress: '{$count}/{$total} items completed.',
			},
		};
	},
};
</script>
