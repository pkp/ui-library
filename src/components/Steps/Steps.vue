<template>
	<div class="pkpSteps" :class="{'pkpSteps--collapsed': collapsed}">
		<div
			ref="buttons"
			class="pkpSteps__buttonWrapper"
			:class="{
				'-screenReader': steps.length === 1
			}"
		>
			<span class="pkpSteps__line" aria-hidden="true" />
			<span
				ref="line"
				class="pkpSteps__line pkpSteps__line__started"
				aria-hidden="true"
			/>
			<ol class="pkpSteps__buttons" :aria-label="label">
				<li
					v-for="(step, i) in steps"
					class="pkpSteps__step"
					:class="{
						'-screenReader': collapsed && !stepsVisible && current !== step.id
					}"
					:key="step.id"
				>
					<template v-if="startedSteps.includes(step.id)">
						<button
							class="pkpSteps__step__label"
							:class="{
								'pkpSteps__step__label--current': current === step.id,
								'pkpSteps__step__label--started': startedSteps.includes(step.id)
							}"
							:ref="'button' + step.id"
							@click="setCurrent(step.id)"
						>
							<span class="pkpSteps__step__number">{{ i + 1 }}</span>
							{{ step.label }}
						</button>
					</template>
					<template v-else>
						<span class="pkpSteps__step__label" :ref="'button' + step.id">
							<span class="pkpSteps__step__number">{{ i + 1 }}</span>
							{{ step.label }}
						</span>
					</template>
				</li>
			</ol>
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
		current: {
			type: String,
			required: true
		},
		startedSteps: {
			type: Array,
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
		 * Check the width of this element and switch between collapsed
		 * or expanded view depending on whether all the steps fit within
		 * the allowed width
		 */
		maybeToggleCollapsedView() {
			const totalWidth = this.$refs.buttons.offsetWidth;
			const allSteps = this.$refs.buttons.querySelectorAll('li');
			const allStepsWidth = Array.prototype.slice
				.call(allSteps)
				.reduce((totalWidth, button) => {
					return totalWidth + button.offsetWidth;
				}, 0);
			this.collapsed = allStepsWidth > totalWidth;
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
		},

		/**
		 * Set the width/height of the line between steps that
		 * shows which steps have been started
		 */
		setStartedLine() {
			if (this.startedSteps.length < 2) {
				this.$refs.line.style.right = 'auto';
				return;
			}
			const lastStep = this.steps.reduce((last, current) => {
				return this.startedSteps.includes(current.id) ? current : last;
			}, this.startedSteps[0]);
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
			this.setStartedLine();
			this.$nextTick(() => {
				this.setFocusIn(this.$el.querySelector('.pkpStep:not([hidden])'));
				this.$scrollTo(this.$el, 500, {
					offset: -50
				});
			});
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
		this.$nextTick(() => this.setStartedLine());
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
	margin: 0;
	padding: 0;
	// Align buttons with controls when collapsed
	margin-top: 1px;
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

.pkpSteps__step {
	list-style: none;
	// Make line-height consistent for button and span labels
	line-height: @line-sml;
}

.pkpSteps__step__label {
	position: relative;
	display: inline-block;
	padding: 1em;
	border: none;
	text-decoration: none;
	font-size: @font-sml;
	font-weight: @bold;
	white-space: nowrap;
	// cover the line connecting each step
	background: @lift;
	z-index: 2;
}

.pkpSteps__step__number {
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
	outline-offset: 2px;
}

.pkpSteps__step__label--started {
	color: @primary;

	.pkpSteps__step__number {
		background: @primary;
		color: @lift;
		border-color: @primary;
	}

	&:hover {
		outline: 0;

		.pkpSteps__step__number {
			outline: @bg-border;
		}
	}

	&:focus {
		outline: 0;

		.pkpSteps__step__number {
			outline: 2px solid @primary;
		}
	}
}

.pkpSteps__step__label--current {
	.pkpSteps__step__number {
		outline: 1px solid @primary;
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

.pkpSteps__line__started {
	right: auto;
	background: @primary;
}

.pkpSteps--collapsed {
	.pkpSteps__line,
	.pkpSteps__line__started {
		display: none;
	}

	.pkpSteps__buttons {
		flex-direction: column;
		align-items: flex-start;
	}
}
</style>
