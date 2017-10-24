<template>
		<div class="pkpListPanel__notice" tabindex="0">
			<span v-if="type === 'info'" class="fa fa-info-circle pkpIcon--inline" aria-hidden="true"></span>
			<span v-else-if="type === 'warning'" class="fa fa-exclamation-triangle pkpIcon--inline" aria-hidden="true"></span>
			{{ notice }}
		</div>
</template>

<script>
export default {
	name: 'ListPanelNotice',
	props: ['notice', 'type'],
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
