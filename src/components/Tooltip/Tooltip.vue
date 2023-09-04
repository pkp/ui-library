<template>
	<button
		v-tooltip="{
			content: tooltip,
			theme: 'pkp-tooltip',
		}"
		class="tooltipButton"
		@click.prevent
	>
		<icon icon="question-circle" />
		<span class="-screenReader">{{ label }}</span>
	</button>
</template>

<script>
import 'floating-vue/dist/style.css';

export default {
	name: 'Tooltip',
	props: {
		tooltip: {
			type: String,
			required: true,
		},
		label: {
			type: String,
			required: true,
		},
	},
};
</script>

<style lang="less">
@import '../../styles/_import';

.tooltip {
	z-index: 9999; // Raise above modals
}

.tooltipButton {
	display: inline-block;
	border: none;
	padding: 0 0.25em;
	background: transparent;
	cursor: pointer;
}
/* Override default styling */
.v-popper--theme-tooltip.v-popper--theme-pkp-tooltip {
	.v-popper__inner {
		padding: 0.7em;
		max-width: 320px;
		font-size: 12px;
		line-height: 16px;

		a {
			color: #fff;
		}
	}
}
</style>
