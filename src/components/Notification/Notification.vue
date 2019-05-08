<template>
	<div class="pkpNotification" :classes="classes">
		<icon v-if="type === 'info'" icon="info-circle" :inline="true" />
		<slot />
	</div>
</template>

<script>
import Icon from '@/components/Icon/Icon.vue';

export default {
	components: {
		Icon
	},
	props: {
		type: {
			type: String,
			default() {
				return '';
			}
		}
	},
	computed: {
		/**
		 * Classes to apply to root element
		 *
		 * @return {Array}
		 */
		classes() {
			let classes = [];
			if (this.type) {
				classes.push('pkpNotification--' + this.type);
			}
			return classes;
		}
	}
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpNotification {
	padding: 0.5rem 0.75rem;
	border: 1px solid @primary;
	box-shadow: inset 0.25rem 0 0 @primary;
	font-size: @font-sml;
	line-height: 1.6em;
}
</style>
