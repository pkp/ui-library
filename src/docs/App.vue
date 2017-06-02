<template>
	<div id="app">
		<sidebar></sidebar>
		<router-view></router-view>
	</div>
</template>

<script>
import Sidebar from './Sidebar.vue';

export default {
	name: 'app',
	components: {
		Sidebar,
		// ViewComponent,
	},
};
</script>
