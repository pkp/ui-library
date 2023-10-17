<script>
import Icon from '@/components/Icon/Icon.vue';

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

export default {
	components: {
		Icon,
	},
	props: {
		progress: Number,
	},
	data() {
		const boxWidth = 24;

		const colorStrokeWidth = 1.5;
		const shadowStrokeWidth = 1;
		const colorStrokePosition = calculatePosition(boxWidth, colorStrokeWidth);
		const shadowStrokePosition = calculatePosition(boxWidth, shadowStrokeWidth);
		const singleCirclePosition = calculatePosition(boxWidth, 0);

		const circumference = colorStrokePosition.radius * 2 * Math.PI;
		return {
			boxWidth,
			colorStrokePosition,
			shadowStrokePosition,
			singleCirclePosition,
			colorStrokeWidth,
			shadowStrokeWidth,
			circumference,
		};
	},
	computed: {
		strokeDashArray() {
			/**
			 * By default strokeDashArray pattern starts in different position (on the right, not top)
			 * in the https://css-tricks.com/building-progress-ring-quickly/ they compensate it
			 * by rotation of circle, but bit of Math can achieve the same effect without rotating the circle
			 */

			const arcLength = (this.progress / 100) * this.circumference;
			const remainingLength = this.circumference - arcLength;
			const originPoint = 0.75 * this.circumference;
			const arcEndPoint = originPoint - arcLength;

			let segments;

			// strokeDashArray goes clock-wise, but our progress is counter-clock wise
			if (this.progress <= 75) {
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
		},
	},
};
</script>
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
				class="stroke-primary"
				fill="transparent"
				:stroke-dasharray="strokeDashArray"
				:stroke-width="colorStrokePosition.width"
				:r="colorStrokePosition.radius"
				:cx="colorStrokePosition.x"
				:cy="colorStrokePosition.y"
			/>
			<!--<circle
				class="fill-state-success"
				:r="singleCirclePosition.radius"
				:cx="singleCirclePosition.x"
				:cy="singleCirclePosition.y"
			/>-->
		</svg>
		<span v-if="true" class="absolute text-sm-normal">15</span>
		<icon v-if="false" class="absolute w-3.5" icon="pkp-envelope-closed" />
	</span>
</template>
<style></style>
