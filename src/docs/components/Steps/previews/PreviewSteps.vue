<template>
	<div ref="wrapper" class="previewSteps">
		<steps
			:started-steps="startedSteps"
			:current="currentStep"
			label="Demonstration of steps component"
			progress-label="{$current}/{$total} steps"
			:scroll-to="$refs.wrapper"
			show-steps-label="Show/hide all steps"
			@step:open="openStep"
		>
			<step id="first" label="First step">
				<panel>
					<panel-section>
						First step content with a
						<a href="...">focusable</a>
						element.
					</panel-section>
				</panel>
			</step>
			<step id="second" label="Second step">
				<panel>
					<panel-section>
						Second step content with a
						<a href="...">focusable</a>
						element.
					</panel-section>
				</panel>
			</step>
			<step id="third" label="Third step">
				<panel>
					<panel-section>Third step content</panel-section>
				</panel>
			</step>
			<step id="fourth" label="Fourth step">
				<panel>
					<panel-section>Fourth step content</panel-section>
				</panel>
			</step>
			<step id="fifth" label="Fifth step">
				<panel>
					<panel-section>Fifth step content</panel-section>
				</panel>
			</step>
		</steps>
		<button-row>
			<pkp-button @click="previousStep">Previous</pkp-button>
			<pkp-button @click="nextStep">Next</pkp-button>
		</button-row>
	</div>
</template>

<script>
import ButtonRow from '../../../../components/ButtonRow/ButtonRow.vue';

export default {
	components: {
		ButtonRow,
	},
	data() {
		return {
			currentStep: 'first',
			startedSteps: ['first'],
			steps: [
				{id: 'first'},
				{id: 'second'},
				{id: 'third'},
				{id: 'fourth'},
				{id: 'fifth'},
			],
		};
	},
	computed: {
		/**
		 * The array index of the current step
		 */
		currentStepIndex() {
			return this.steps.findIndex((step) => step.id === this.currentStep);
		},
	},
	methods: {
		/**
		 * Open a step
		 */
		openStep(step) {
			this.currentStep = step;
			if (!this.startedSteps.includes(step)) {
				this.startedSteps.push(step);
			}
		},

		/**
		 * Go to the next step
		 */
		nextStep() {
			this.openStep(this.steps[1 + this.currentStepIndex].id);
		},

		/**
		 * Go to the previous step
		 */
		previousStep() {
			const previousIndex = this.currentStepIndex - 1;
			if (previousIndex >= 0) {
				this.openStep(this.steps[previousIndex].id);
			}
		},
	},
};
</script>

<style lang="less">
@import '../../../../styles/_import';

.component--Steps .component__exampleWrapper {
	background: @bg;
}

.previewSteps .panel {
	margin-top: 2rem;
	border: none;
}

.previewSteps .buttonRow {
	margin-top: 2rem;
}
</style>
