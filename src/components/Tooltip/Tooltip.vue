<template>
	<span
		v-tooltip="{
			content: tooltip,
			theme: 'pkp-tooltip',
		}"
		class="tooltipButton"
		@click.prevent
	>
		<Icon
			:icon="isPrimary ? 'UsefulTipsPrimary' : 'UsefulTips'"
			:class="iconClass"
		/>
		<span v-if="label" class="-screenReader">{{ label }}</span>
	</span>
</template>

<script>
import 'floating-vue/dist/style.css';
import Icon from '@/components/Icon/Icon.vue';

export default {
	name: 'Tooltip',
	components: {Icon},
	props: {
		/** The message to display in the popup. */
		tooltip: {
			type: String,
			required: true,
		},
		/** A label for the button that screenreaders will use to understand it. This should refer to the thing it is describing. A tooltip for the submission subtitle field might say "Tooltip for subtitle". */
		label: {
			type: String,
			required: true,
		},
		/** Indicates the icon size: medium (16px), small (14 px) */
		iconSize: {
			type: String,
			default: () => 'medium',
			validator: (value) => {
				return ['medium', 'small'].includes(value);
			},
		},
		/** If the icon color should use primary color (blue) */
		isPrimary: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		iconClass() {
			return {
				'h-4 w-4': this.iconSize !== 'small',
				'h-3 w-3': this.iconSize === 'small',
				'text-primary': this.isPrimary,
			};
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
