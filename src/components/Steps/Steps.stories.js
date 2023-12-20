import {ref, computed} from 'vue';
import Steps from './Steps.vue';
import Step from './Step.vue';
import Panel from '@/components/Panel/Panel.vue';
import PanelSection from '@/components/Panel/PanelSection.vue';
import ButtonRow from '@/components/ButtonRow/ButtonRow.vue';

import './Steps.stories.less';

export default {
	title: 'Components/Steps',
	component: Steps,
};

export const Default = {
	render: (args) => ({
		components: {Steps, Step, Panel, PanelSection, ButtonRow},
		setup() {
			const currentStep = ref('first');
			const startedSteps = ref(['first']);
			const steps = ref([
				{id: 'first'},
				{id: 'second'},
				{id: 'third'},
				{id: 'fourth'},
				{id: 'fifth'},
			]);

			const currentStepIndex = computed(() =>
				steps.value.findIndex((step) => step.id === currentStep.value),
			);

			function openStep(step) {
				currentStep.value = step;
				if (!startedSteps.value.includes(step)) {
					startedSteps.value.push(step);
				}
			}

			function nextStep() {
				openStep(steps.value[1 + currentStepIndex.value].id);
			}

			function previousStep() {
				const previousIndex = currentStepIndex.value - 1;
				if (previousIndex >= 0) {
					openStep(steps.value[previousIndex].id);
				}
			}

			return {
				args,
				currentStep,
				startedSteps,
				steps,
				currentStepIndex,
				openStep,
				nextStep,
				previousStep,
			};
		},
		template: `
		<div ref="wrapper" class="previewSteps">
			<Steps
				:started-steps="startedSteps"
				:current="currentStep"
				label="Demonstration of steps component"
				progress-label="{$current}/{$total} steps"
				:scroll-to="$refs.wrapper"
				show-steps-label="Show/hide all steps"
				@step:open="openStep"
			>
				<Step id="first" label="First step">
					<Panel>
						<PanelSection>
							First step content with a
							<a href="...">focusable</a>
							element.
						</PanelSection>
					</Panel>
				</Step>
				<Step id="second" label="Second step">
					<Panel>
						<PanelSection>
							Second step content with a
							<a href="...">focusable</a>
							element.
						</PanelSection>
					</Panel>
				</Step>
				<Step id="third" label="Third step">
					<Panel>
						<PanelSection>Third step content</PanelSection>
					</Panel>
				</Step>
				<Step id="fourth" label="Fourth step">
					<Panel>
						<PanelSection>Fourth step content</PanelSection>
					</Panel>
				</Step>
				<Step id="fifth" label="Fifth step">
					<Panel>
						<PanelSection>Fifth step content</PanelSection>
					</Panel>
				</Step>
			</Steps>
			<ButtonRow>
				<PkpButton @click="previousStep">Previous</PkpButton>
				<PkpButton @click="nextStep">Next</PkpButton>
			</ButtonRow>
		</div>
		`,
	}),
};
