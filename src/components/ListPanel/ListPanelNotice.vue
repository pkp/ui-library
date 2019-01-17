<template>
		<div class="pkpListPanel__notice" tabindex="0">
			<icon v-if="type === 'info'" icon="info-circle" :inline="true"/>
			<icon v-else-if="type === 'warning'" icon="exclamation-triangle" :inline="true"/>
			{{ notice }}
		</div>
</template>

<script>
import Icon from '@/components/Icon/Icon.vue';

export default {
	name: 'ListPanelNotice',
	components: {
		Icon
	},
	props: ['notice', 'type']
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpListPanel__notice {
	padding: 1em;
	background: @bg-light;
	border-bottom: @grid-border;
	font-size: @font-sml;
	line-height: @line-sml;

	&:focus {
		box-shadow: -2px 0 0 @primary;
		outline: 0;
	}
}
</style>
