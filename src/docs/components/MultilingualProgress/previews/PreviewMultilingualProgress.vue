<template>
	<multilingual-progress :count="1" :total="3" />
</template>

<script>
import MultilingualProgress from '@/components/MultilingualProgress/MultilingualProgress.vue';

export default {
	components: {
		MultilingualProgress
	}
};
</script>
