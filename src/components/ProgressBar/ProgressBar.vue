<template>
	<div class="progressBar">
		<div
			class="progressBar__progress"
			:style="{width: progress + '%'}"
			:aria-valuenow="value"
			:aria-valuemin="min"
			:aria-valuemax="max"
			role="progressbar"
		/>
	</div>
</template>

<script>
export default {
	props: {
		max: {
			type: Number,
			default() {
				return 100;
			}
		},
		min: {
			type: Number,
			default() {
				return 0;
			}
		},
		value: {
			type: Number,
			required: true
		}
	},
	computed: {
		progress() {
			return ((this.value / this.max) * 100).toFixed(0);
		}
	}
};
</script>

<style lang="less">
@import '../../styles/_import';

@keyframes progressBar {
	0% {
		background: @primary;
	}
	50% {
		background: @primary-lift;
	}
	100% {
		background: @primary;
	}
}

.progressBar {
	position: relative;
	display: block;
	height: 0.5rem;
	background: @bg;
	border-radius: 0.25rem;
	overflow: hidden; // apply border-radius to progress bar
}

.progressBar__progress {
	position: absolute;
	top: 0;
	left: 0;
	display: block;
	height: 0.5rem;
	background: @primary;
	transition: 0.2s all;
	animation: progressBar 2s infinite;
}
</style>
