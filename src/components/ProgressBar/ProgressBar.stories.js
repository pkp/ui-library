import {ref} from 'vue';
import ProgressBar from './ProgressBar.vue';
export default {
	title: 'Components/ProgressBar',
	component: ProgressBar,
};

export const Default = {
	render: (args) => ({
		components: {ProgressBar},
		setup() {
			return {args};
		},
		template: `
			<ProgressBar v-bind="args"/>
		`,
	}),
	args: {
		value: 10,
	},
};

export const SlowProgress = {
	render: (args) => ({
		components: {ProgressBar},
		setup() {
			let slowInterval = null;
			const slowValue = ref(0);

			slowInterval = setInterval(() => {
				if (slowValue.value < 100) {
					slowValue.value =
						slowValue.value + 8 > 100 ? 100 : slowValue.value + 8;
				} else {
					clearInterval(slowInterval);
				}
			}, 1700);

			return {value: slowValue};
		},
		template: `
			<ProgressBar :value="value"/>
		`,
	}),
	args: {},
};

export const FastProgress = {
	render: (args) => ({
		components: {ProgressBar},
		setup() {
			let slowInterval = null;
			const slowValue = ref(0);

			slowInterval = setInterval(() => {
				if (slowValue.value < 100) {
					slowValue.value =
						slowValue.value + 23 > 100 ? 100 : slowValue.value + 23;
				} else {
					clearInterval(slowInterval);
				}
			}, 1000);

			return {value: slowValue};
		},
		template: `
			<ProgressBar :value="value"/>
		`,
	}),
	args: {},
};
