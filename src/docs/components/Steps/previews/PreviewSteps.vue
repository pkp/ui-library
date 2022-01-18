<template>
	<steps
		:initializedSteps="initializedSteps"
		:current="currentStep"
		label="Demonstration of steps component"
		progressLabel="{$current}/{$total} steps"
		showStepsLabel="Show all steps"
		@step:open="openStep"
	>
		<step label="First step" id="first">
			First step content.
		</step>
		<step label="Second step" id="second">
			Second step content with a
			<a href="...">focusable</a>
			element.
		</step>
		<step label="Third step" id="third">
			Third step content
		</step>
		<step label="Fourth step" id="fourth">
			Fourth step content
		</step>
		<step label="Fifth step" id="fifth">
			Fifth step content
		</step>
	</steps>
</template>

<script>
export default {
	data() {
		return {
			currentStep: 'first',
			initializedSteps: ['first']
		};
	},
	methods: {
		openStep(step) {
			this.currentStep = step;
			if (!this.initializedSteps.includes(step)) {
				this.initializedSteps.push(step);
			}
		}
	}
};
</script>

<style lang="less">
@import '../../../../styles/_import';

.component--Steps .component__exampleWrapper {
	background: @bg;
}
</style>
