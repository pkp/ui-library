<template>
	<div class="pkpSteps" :class="{'pkpSteps--collapsed': collapsed}">
		<div
			ref="buttons"
			class="pkpSteps__buttonWrapper"
			:class="{
				'-screenReader': steps.length === 1,
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
					:key="step.id"
					class="pkpSteps__step"
					:class="{
						'-screenReader': collapsed && !stepsVisible && current !== step.id,
					}"
				>
					<template v-if="startedSteps.includes(step.id)">
						<span>
							<button
								:ref="'button' + step.id"
								class="pkpSteps__step__label"
								:class="
									current === step.id
										? 'pkpSteps__step__label--current'
										: completedSteps.includes(step.id)
											? 'pkpSteps__step__label--completed'
											: ''
								"
								@click="setCurrent(step.id)"
							>
								<span class="pkpSteps__step__number">
									<template
										v-if="
											current !== step.id && completedSteps.includes(step.id)
										"
									>
										<Icon icon="Complete" class="h-4 w-4" />
									</template>
									<template v-else>
										{{ i + 1 }}
									</template>
								</span>
								{{ step.label }}
							</button>
						</span>
					</template>
					<template v-else>
						<span :ref="'button' + step.id" class="pkpSteps__step__label">
							<span class="pkpSteps__step__number">{{ i + 1 }}</span>
							{{ step.label }}
						</span>
					</template>
				</li>
			</ol>
			<div v-if="collapsed" class="pkpSteps__controls" aria-hidden="true">
				<span class="relative bottom-1 me-1 text-lg-normal">
					{{ progress }}
				</span>
				<PkpButton
					class="!px-2 !py-1"
					@click="() => (stepsVisible = !stepsVisible)"
				>
					<span class="-screenReader">
						{{ showStepsLabel }}
					</span>
					<Icon
						:icon="stepsVisible ? 'ChevronUp' : 'ChevronDown'"
						class="h-5 w-5"
					/>
				</PkpButton>
			</div>
		</div>
		<slot />
	</div>
</template>

<script>
import debounce from 'debounce';
import elementResizeEvent from 'element-resize-event';
import PkpButton from '@/components/Button/Button.vue';
import Icon from '@/components/Icon/Icon.vue';

export default {
	components: {PkpButton, Icon},
	provide() {
		return {
			registerStep: (step) => {
				this.steps.push(step);

				// Return an unregistration function for cleanup
				return () => {
					const index = this.steps.findIndex((_step) => _step.id === step.id);
					if (index > -1) {
						this.steps.splice(index, 1);
					}
				};
			},
		};
	},
	props: {
		/** The `id` of the current step. */
		current: {
			type: String,
			required: true,
		},
		/** An array of step `id`s that have already been started. */
		startedSteps: {
			type: Array,
			required: true,
		},
		/** A localized string describing the steps for assistive technology. */
		label: {
			type: String,
			required: true,
		},
		/** A localized string with `{$current}` and `{$total}` that describes the current and total steps. Example: `{$current}/{$total} steps` */
		progressLabel: {
			type: String,
			required: true,
		},
		/**
		 * The DOM element to scroll into view when changing steps.
		 * This is expected to be a ref from the parent component.
		 *
		 */
		scrollTo: {
			type: HTMLElement,
			default() {
				return null;
			},
		},
		/** A localized string for the button to show all steps when the steps are viewed on a small device. */
		showStepsLabel: {
			type: String,
			required: true,
		},
	},
	emits: [
		/** Emitted when a new step is opened with payload of the step `id`. */
		'step:open',
	],
	data() {
		return {
			collapsed: false,
			steps: [],
			stepsVisible: false,
		};
	},
	computed: {
		/**
		 * The steps that have been completed
		 */
		completedSteps() {
			return this.startedSteps.slice(0, -1);
		},

		/**
		 * The current progress, eg - 1/5 steps
		 * @return String
		 */
		progress() {
			return this.progressLabel
				.replace(
					'{$current}',
					1 + this.steps.findIndex((step) => step.id === this.current),
				)
				.replace('{$total}', this.steps.length);
		},
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
			this.$nextTick(() => {
				this.setStartedLine();
				this.setFocusIn(this.$el.querySelector('.pkpStep:not([hidden])'));
				if (this.scrollTo) {
					this.$scrollTo(this.scrollTo, 500, {
						offset: -50,
					});
				}
			});
		},
	},
	mounted() {
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
	},
	methods: {
		/**
		 * Check the width of this element and switch between collapsed
		 * or expanded view depending on whether all the steps fit within
		 * the allowed width
		 */
		maybeToggleCollapsedView() {
			const totalWidth = this.$refs.buttons.offsetWidth;
			const allSteps = this.$refs.buttons.querySelectorAll('li>span');
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
			this.steps.forEach((step) => step.isActive(step.id === stepId));
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
		},
	},
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
	padding: 0.75rem;
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
	color: @text-light;
	white-space: nowrap;
	// cover the line connecting each step
	background: @lift;
	z-index: 2;

	&:hover,
	&:focus {
		outline: 0;
	}
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
	margin-inline-end: 0.25rem;
	// Align with the text
	position: relative;
	top: -1px;
	outline-offset: 2px;
}

.pkpSteps__step__label--completed {
	color: @text;

	.pkpSteps__step__number {
		background: @primary;
		color: @lift;
		border-color: transparent;
	}

	&:hover {
		.pkpSteps__step__number {
			outline: @bg-border;
		}
	}

	&:focus {
		.pkpSteps__step__number {
			outline: 2px solid @primary;
		}
	}
}

.pkpSteps__step__label--current {
	color: @primary;

	.pkpSteps__step__number {
		border-color: @primary;
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
