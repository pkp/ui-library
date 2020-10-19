<template>
	<div class="previewProgressBar">
		<progress-bar :value="25" />
		<progress-bar :value="75" />
		<progress-bar :value="fastValue" />
		<progress-bar :value="slowValue" />
		<pkp-button @click="start">Restart</pkp-button>
	</div>
</template>

<script>
import ProgressBar from '@/components/ProgressBar/ProgressBar.vue';

export default {
	components: {
		ProgressBar
	},
	data() {
		return {
			fastInterval: null,
			fastValue: 0,
			slowInterval: null,
			slowValue: 0
		};
	},
	methods: {
		start() {
			if (this.fastInterval) {
				clearInterval(this.fastInterval);
			}
			if (this.slowInterval) {
				clearInterval(this.slowInterval);
			}
			this.fastValue = 0;
			this.slowValue = 0;
			this.fastInterval = setInterval(() => {
				if (this.fastValue < 100) {
					this.fastValue =
						this.fastValue + 23 > 100 ? 100 : this.fastValue + 23;
				} else {
					clearInterval(this.fastInterval);
				}
			}, 1000);
			this.slowInterval = setInterval(() => {
				if (this.slowValue < 100) {
					this.slowValue = this.slowValue + 8 > 100 ? 100 : this.slowValue + 8;
				} else {
					clearInterval(this.slowInterval);
				}
			}, 1700);
		}
	},
	mounted() {
		this.start();
	}
};
</script>

<style lang="less">
.previewProgressBar > * + * {
	margin-top: 2rem;
}
</style>
