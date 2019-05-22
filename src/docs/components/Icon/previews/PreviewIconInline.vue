<template>
	<div class="inlineIconPreview">
		<icon icon="search" :inline="true" />
		Search
	</div>
</template>

<script>
import Icon from '@/components/Icon/Icon.vue';

export default {
	components: {
		Icon
	}
};
</script>

<style lang="less">
@import '../../../../styles/_import';

.inlineIconPreview {
	font-size: @font-sml;
}
</style>
