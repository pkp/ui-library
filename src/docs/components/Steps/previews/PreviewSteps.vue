<template>
	<div class="previewSteps">
		<steps
			:startedSteps="startedSteps"
			:current="currentStep"
			label="Demonstration of steps component"
			progressLabel="{$current}/{$total} steps"
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
		<div class="previewSteps__buttons">
			<pkp-button @click="previous">Previous</pkp-button>
			<pkp-button @click="next">Next</pkp-button>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			currentStep: 'first',
			startedSteps: ['first']
		};
	},
	methods: {
		openStep(step) {
			this.currentStep = step;
			if (!this.startedSteps.includes(step)) {
				this.startedSteps.push(step);
			}
		},
		next() {
			switch (this.currentStep) {
				case 'first':
					this.openStep('second');
					break;
				case 'second':
					this.openStep('third');
					break;
				case 'third':
					this.openStep('fourth');
					break;
				case 'fourth':
					this.openStep('fifth');
					break;
			}
		},
		previous() {
			switch (this.currentStep) {
				case 'second':
					this.openStep('first');
					break;
				case 'third':
					this.openStep('second');
					break;
				case 'fourth':
					this.openStep('third');
					break;
				case 'fifth':
					this.openStep('fourth');
					break;
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

.previewSteps .panel {
	margin-top: 2rem;
	border: none;
}

.previewSteps__buttons {
	margin-top: 2rem;
	display: flex;
	justify-content: flex-end;
}
</style>
