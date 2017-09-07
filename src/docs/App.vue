<template>
	<div id="app">
		<sidebar></sidebar>
		<router-view></router-view>
	</div>
</template>

<script>
import Sidebar from '@/docs/Sidebar.vue';

export default {
	name: 'app',
	components: {
		Sidebar,
	},
};
</script>

<style lang="less">
@import '../styles/normalize';
@import '../styles/_import';
@import '../styles/font-awesome/variables';
@import '../styles/font-awesome/core';
@import '../styles/font-awesome/icons';
@import '../styles/elements/screen-reader';
@import '../styles/elements/spinner';
@import '../styles/elements/buttons';
@import '../styles/elements/icons';

*, *:before, *:after {
  box-sizing: border-box;
}

html,
body {
	height: 100%;
}

body {
	display: flex;
	margin: 0;
	background: @lift;
	font-family: @font;
	font-size: @font-base;
	line-height: @double;
	color: @text-rgba;
}

a {
	color: @primary;

	&:hover,
	&:focus {
		color: @primary-lift;
	}

	&[disabled] {
		color: @text-light-rgba;
		cursor: not-allowed;
	}
}

#app {
	display: flex;
	align-items: stretch;
}

.pkpul-sidebar {
	flex: 0 0 15rem;
}
</style>
