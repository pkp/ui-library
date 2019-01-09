<template>
	<button v-tooltip="tooltip" class="tooltipButton" @click.prevent>
		<icon icon="question-circle" />
		<span class="-screenReader">{{ label }}</span>
	</button>
</template>

<script>
import Icon from '@/components/Icon/Icon.vue';

export default {
	name: 'Tooltip',
	components: {
		Icon,
	},
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
</style>
