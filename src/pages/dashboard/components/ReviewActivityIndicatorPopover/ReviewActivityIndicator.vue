<template>
	<span class="relative inline-flex items-center justify-center">
		<svg :height="boxWidth" :width="boxWidth">
			<circle
				stroke="#BBBBBB"
				fill="transparent"
				:stroke-width="shadowStrokePosition.width"
				:r="shadowStrokePosition.radius"
				:cx="shadowStrokePosition.x"
				:cy="shadowStrokePosition.y"
			/>
			<circle
				v-if="strokeColorClass"
				:class="strokeColorClass"
				fill="transparent"
				:stroke-dasharray="strokeDashArray"
				:stroke-width="colorStrokePosition.width"
				:r="colorStrokePosition.radius"
				:cx="colorStrokePosition.x"
				:cy="colorStrokePosition.y"
			/>
			<circle
				v-if="fillColorClass"
				:class="fillColorClass"
				:r="singleCirclePosition.radius"
				:cx="singleCirclePosition.x"
				:cy="singleCirclePosition.y"
			/>
		</svg>
		<span v-if="text" :class="textColorClass" class="absolute text-sm-normal">
			{{ text }}
		</span>
		<Icon
			v-if="icon"
			:class="textColorClass"
			class="absolute h-5 w-5"
			:icon="icon"
		/>
	</span>
</template>

<script setup>
import Icon from '@/components/Icon/Icon.vue';
import {defineProps, computed} from 'vue';

function calculatePosition(boxWidth, strokeWidth) {
	const radius = (boxWidth - strokeWidth) / 2;

	return {
		radius,
		width: strokeWidth,
		x: radius + strokeWidth / 2,
		y: radius + strokeWidth / 2,
	};
}

/**
 * Using svg to draw circles (https://css-tricks.com/building-progress-ring-quickly/)
 * Nice alternative would be using radial-gradient and conic-gradient (https://nikitahl.com/circle-progress-bar-css),
 * but browser support is not good enough for our current target.
 */

const props = defineProps({
	colorVariant: {
		required: true,
		type: String,
		validator: (prop) =>
			[
				'primary',
				'attention',
				'negative',
				'success',
				'stage-in-review',
			].includes(prop),
	},
	displayVariant: {
		required: true,
		type: String,
		validator: (prop) => ['progress', 'fill'].includes(prop),
	},
	progress: {type: Number, required: false, default: () => null},
	icon: {type: String, required: false, default: () => null},
	text: {type: String, required: false, default: () => null},
});

const boxWidth = 24;

const colorStrokeWidth = 1.5;
const shadowStrokeWidth = 1;
const colorStrokePosition = calculatePosition(boxWidth, colorStrokeWidth);
const shadowStrokePosition = calculatePosition(boxWidth, shadowStrokeWidth);
// eslint-disable-next-line no-unused-vars
const singleCirclePosition = calculatePosition(boxWidth, 0);

const circumference = colorStrokePosition.radius * 2 * Math.PI;

const textColorClass = computed(() => {
	if (props.displayVariant === 'fill') {
		if (
			['attention', 'negative', 'stage-in-review', 'success'].includes(
				props.colorVariant,
			)
		) {
			return 'text-on-dark';
		}
	}

	return 'text-default';
});

const strokeColorClass = computed(() => {
	if (props.displayVariant === 'progress') {
		const colorVariantToClassMapping = {
			primary: 'stroke-primary',
			attention: 'stroke-attention',
			negative: 'stroke-negative',
			success: 'stroke-success',
			'stage-in-review': 'stroke-stage-in-review',
		};

		return colorVariantToClassMapping[props.colorVariant];
	}

	return '';
});

const fillColorClass = computed(() => {
	if (props.displayVariant === 'fill') {
		const colorVariantToClassMapping = {
			primary: 'fill-primary',
			attention: 'fill-attention',
			negative: 'fill-negative',
			success: 'fill-success',
			'stage-in-review': 'fill-stage-in-review',
		};

		return colorVariantToClassMapping[props.colorVariant];
	}

	return '';
});

const strokeDashArray = computed(() => {
	/**
	 * By default strokeDashArray pattern starts in different position (on the right, not top)
	 * in the https://css-tricks.com/building-progress-ring-quickly/ they compensate it
	 * by rotation of circle, but bit of Math can achieve the same effect without rotating the circle
	 */

	const arcLength = (props.progress / 100) * circumference;
	const remainingLength = circumference - arcLength;
	const originPoint = 0.75 * circumference;
	const arcEndPoint = originPoint - arcLength;

	let segments;

	// strokeDashArray goes clock-wise, but our progress is counter-clock wise
	if (props.progress <= 75) {
		segments = [
			0, //  zero to skip blue part
			arcEndPoint,
			arcLength,
			remainingLength,
		];
	} else {
		segments = [originPoint, remainingLength];
	}

	return segments.join(' ');
});
</script>

<style></style>
