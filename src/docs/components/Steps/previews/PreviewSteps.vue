<template>
	<div class="previewSteps" ref="wrapper">
		<steps
			:startedSteps="startedSteps"
			:current="currentStep"
			label="Demonstration of steps component"
			progressLabel="{$current}/{$total} steps"
			:scrollTo="$refs.wrapper"
			showStepsLabel="Show/hide all steps"
			@step:open="openStep"
		>
			<step label="First step" id="first">
				<panel>
					<panel-section>
						First step content with a
						<a href="...">focusable</a>
						element.
					</panel-section>
				</panel>
			</step>
			<step label="Second step" id="second">
				<panel>
					<panel-section>
						Second step content with a
						<a href="...">focusable</a>
						element.
					</panel-section>
				</panel>
			</step>
			<step label="Third step" id="third">
				<panel>
					<panel-section>Third step content</panel-section>
				</panel>
			</step>
			<step label="Fourth step" id="fourth">
				<panel>
					<panel-section>Fourth step content</panel-section>
				</panel>
			</step>
			<step label="Fifth step" id="fifth">
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
			steps: [],
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
	mounted() {
		/**
		 * Get an array of all the step components
		 */
		this.steps = this.$children
			.find((child) => child.$options._componentTag === 'steps')
			.$children.filter((child) => child.$options._componentTag === 'step');
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
