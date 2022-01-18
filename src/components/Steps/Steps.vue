<template>
	<div class="pkpSteps">
		<div
			ref="buttons"
			class="pkpSteps__buttonWrapper"
			:class="{'-screenReader': steps.length === 1}"
		>
			<div
				class="pkpSteps__buttons"
				:class="{'pkpSteps__buttons--collapsed': collapsed}"
				role="tablist"
				:aria-label="label"
			>
				<span class="pkpSteps__line" aria-hidden="true" />
				<span
					ref="line"
					class="pkpSteps__line pkpSteps__line--initialized"
					aria-hidden="true"
				/>
				<button
					v-for="(step, i) in steps"
					:aria-selected="current === step.id"
					:aria-controls="step.id"
					class="pkpSteps__button"
					:class="{
						'pkpSteps__button--initialized': initializedSteps.includes(step.id),
						'-screenReader': collapsed && !stepsVisible && current !== step.id
					}"
					:id="step.id + '-button'"
					:key="step.id"
					:ref="'button' + step.id"
					role="tab"
					:tabindex="current === step.id ? '' : -1"
					@click="setCurrent(step.id)"
					@keydown.35.prevent="setLastStep"
					@keydown.36.prevent="setFirstStep"
					@keydown.left.exact.prevent="focusStepByIndex(i - 1)"
					@keydown.right.exact.prevent="focusStepByIndex(i + 1)"
				>
					<span class="pkpSteps__number">{{ i + 1 }}</span>
					{{ step.label }}
				</button>
			</div>
			<div v-if="collapsed" class="pkpSteps__controls" aria-hidden="true">
				<span class="pkpSteps__progress">
					{{ progress }}
				</span>
				<pkp-button @click="() => (stepsVisible = !stepsVisible)">
					<span class="-screenReader">
						{{ showStepsLabel }}
					</span>
					<icon :icon="stepsVisible ? 'chevron-up' : 'chevron-down'" />
				</pkp-button>
			</div>
		</div>
		<slot />
	</div>
</template>

<script>
import debounce from 'debounce';
import elementResizeEvent from 'element-resize-event';

export default {
	props: {
		initializedSteps: {
			type: Array,
			required: true
		},
		current: {
			type: String,
			required: true
		},
		label: {
			type: String,
			required: true
		},
		progressLabel: {
			type: String,
			required: true
		},
		showStepsLabel: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			collapsed: false,
			steps: [],
			stepsVisible: false
		};
	},
	computed: {
		/**
		 * The current progress, eg - 1/5 steps
		 * @return String
		 */
		progress() {
			return this.progressLabel
				.replace(
					'{$current}',
					1 + this.steps.findIndex(step => step.id === this.current)
				)
				.replace('{$total}', this.steps.length);
		}
	},
	methods: {
		/**
		 * Move the cursor focus to a step
		 */
		focusStep(stepId) {
			this.$refs['button' + stepId][0].focus();
		},

		/**
		 * Move the cursor focus to a step by its index in the
		 * array of steps
		 *
		 * Keyboard: → / ←
		 *
		 * @param Number i The index of the step to focus
		 */
		focusStepByIndex(i) {
			const step = this.steps[i] || null;
			if (step) {
				this.focusStep(step.id);
			}
		},

		/**
		 * Check the width of this element and switch between collapsed
		 * or expanded view depending on whether all the steps fit within
		 * the allowed width
		 */
		maybeToggleCollapsedView() {
			const totalWidth = this.$refs.buttons.offsetWidth;
			const allButtons = this.$refs.buttons.querySelectorAll('[role="tab"]');
			const allButtonsWidth = Array.prototype.slice
				.call(allButtons)
				.reduce((totalWidth, button) => {
					return totalWidth + button.offsetWidth;
				}, 0);
			this.collapsed = allButtonsWidth > totalWidth;
		},

		/**
		 * Set the isActive flag on the child step components
		 *
		 * @param {String} stepId
		 */
		setChildStepsIsActive(stepId) {
			this.steps.forEach(step => (step.isActive = step.id === stepId));
		},

		/**
		 * Set the current step
		 *
		 * @param {String} stepId
		 */
		setCurrent(stepId) {
			this.$emit('step:open', stepId);
			this.$nextTick(() => {
				this.focusStep(stepId);
			});
		},

		/**
		 * Set the current step to the first step in the list
		 *
		 * Keyboard: [Home]
		 */
		setFirstStep() {
			this.focusStep(this.steps[0].id);
		},

		/**
		 * Set the current step to the last step in the list
		 *
		 * Keyboard: [End]
		 */
		setLastStep() {
			this.focusStep(this.steps[this.steps.length - 1].id);
		},

		/**
		 * Set the width/height of the line between steps that
		 * shows which steps have been initialized
		 */
		setInitializedLine() {
			if (this.initializedSteps.length < 2) {
				this.$refs.line.style.right = 'auto';
				return;
			}
			const lastStep = this.steps.reduce((last, current) => {
				return this.initializedSteps.includes(current.id) ? current : last;
			}, this.initializedSteps[0]);
			const width =
				this.$refs.buttons.offsetWidth -
				this.$refs['button' + lastStep.id][0].offsetLeft;
			this.$refs.line.style.right = width + 'px';
		}
	},
	watch: {
		/**
		 * When switching to the collapsed view, only show the active button
		 */
		collapsed(newVal, oldVal) {
			if (newVal !== oldVal && newVal) {
				this.stepsVisible = false;
			}
		},

		/**
		 * Update the currently selected step
		 */
		current(newVal, oldVal) {
			this.setChildStepsIsActive(newVal);
			this.setInitializedLine();
		}
	},
	mounted() {
		/**
		 * Store the nested steps as a data property
		 */
		this.steps = this.$children.filter(
			child => child.$options._componentTag === 'step'
		);

		/**
		 * Set the step to view when loaded
		 */
		this.setChildStepsIsActive(this.current);

		/**
		 * Toggle collapsed view when there is not enough width
		 * for the steps to fit
		 */
		this.maybeToggleCollapsedView();
		elementResizeEvent(this.$el, debounce(this.maybeToggleCollapsedView, 100));

		/**
		 * Set the progress line
		 */
		this.setInitializedLine();
	}
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpSteps__buttonWrapper {
	position: relative;
	display: flex;
	justify-content: space-between;
	background: @lift;
}

.pkpSteps__buttons {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	// Align buttons with controls when collapsed
	margin-top: 1px;
}

.pkpSteps__buttons--collapsed {
	flex-direction: column;
	align-items: flex-start;
}

.pkpSteps__controls,
.pkpSteps__button {
	// Prevents flex from forcing the button to two lines
	white-space: nowrap;
}

.pkpSteps__controls {
	top: -1px;
}

.pkpSteps__progress {
	font-size: @font-sml;
	margin-right: 0.25rem;
}

.pkpSteps__number {
	display: inline-block;
	padding: 0;
	width: 2.5em;
	height: 2.5em;
	line-height: 2.25em;
	border: @bg-border;
	border-radius: 50%;
	font-size: @font-tiny;
	text-align: center;
	margin-right: 0.25rem;
	// Align with the text
	position: relative;
	top: -1px;
}

.pkpSteps__button {
	padding: 1em;
	border: none;
	background: transparent;
	text-decoration: none;
	font-size: @font-sml;
	font-weight: @bold;
	// cover the line connecting each step
	background: @lift;
	z-index: 2;

	&:hover,
	&:focus {
		outline: 0;

		.pkpSteps__number {
			border-color: @primary;
		}
	}
}

.pkpSteps__button--initialized {
	color: @primary;

	.pkpSteps__number {
		background: @primary;
		color: @lift;
		border-color: @primary;
	}

	&:hover,
	&:focus {
		.pkpSteps__number {
			outline: 1px solid @primary;
			outline-offset: 2px;
		}
	}
}

.pkpSteps__line {
	position: absolute;
	top: 50%;
	left: 0;
	right: 0;
	height: 1px;
	transform: translateY(-1px);
	background: @bg-border-color;
	z-index: 1;
}

.pkpSteps__line--initialized {
	right: auto;
	background: @primary;
}
</style>
