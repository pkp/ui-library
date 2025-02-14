<template>
	<button v-if="isButton" :class="classes" @click="click">
		<div class="flex items-center gap-x-2">
			<Icon v-if="icon" class="h-5 w-5" :icon="icon" />
			<slot />
			<span v-if="label" class="-screenReader">{{ label }}</span>
		</div>
	</button>
	<span v-else :class="classes">
		<div class="flex items-center justify-center">
			<Icon v-if="icon" class="me-2 h-5 w-5" :icon="icon" />
			<slot />
			<span v-if="label" class="-screenReader">{{ label }}</span>
		</div>
	</span>
</template>

<script>
import Icon from '@/components/Icon/Icon.vue';

/**
TODO: review the badge use cases after new submission listing
As the dot/button use cases seems to be relevant only for previous submission listing and might be opportunity to remove them
*/

export default {
	name: 'Badge',
	components: {Icon},
	props: {
		/** A hidden label for users without sight */
		label: String,
		/** Badges which should stand out from adjacent badges */
		isPrimary: Boolean,
		/** Badges which describe a successful or complete state */
		isSuccess: Boolean,
		/** Badges which describe an alert or warning */
		isWarnable: Boolean,
		/** If the badge can be used to perform an action, set this to true */
		isButton: Boolean,
		/** Icon name, always displayed on left */
		icon: {required: false, type: String, default: () => null},

		/** Alternative prop to isPrimary/isSuccess/isWarnable to support wider range of color variants	*/
		colorVariant: {
			required: false,
			type: String,
			default: () => null,
			validator: (prop) =>
				[
					'default-on-dark',
					'primary',
					'primary-bg',
					'attention-bg',
					'negative-bg',
					'stage-in-review-bg',
					'success-bg',
					'attention',
				].includes(prop),
		},
		sizeVariant: {
			required: false,
			default: () => 'default',
			// compact is used in reviewer status for competing interest
			validator: (prop) => ['default', 'compact'].includes(prop),
		},
		/**  */
		/** Adds a small dot to the left of the `content` */
		hasDot: Boolean,
		/** Pass a stage name to use a special design for stage badges. Supports: `submission`, `review`, `copyediting`, `production`. */
		stage: String,
	},
	emits: [
		/** This event will be emitted when the badge is clicked and `isButton` is `true`. */
		'click',
	],
	computed: {
		classes() {
			let classes = [];

			if (this.colorVariant) {
				const colorVariant = this.colorVariant;
				return {
					// base
					'inline-block rounded-[1.2em] border': true,
					// size default
					'text-base-normal py-1 px-3': this.sizeVariant === 'default',
					// size compact
					'text-sm-normal py-[0.18rem] px-2': this.sizeVariant === 'compact',
					// default
					'text-default border-light': colorVariant === 'default',
					// default-on-dark
					'text-on-dark border-light': colorVariant === 'default-on-dark',

					// primary
					'border-primary text-primary bg-secondary':
						colorVariant === 'primary',
					// attention-border
					'border-dark text-attention bg-secondary':
						colorVariant === 'attention',
					// primary-bg
					'bg-primary text-on-dark border-primary':
						colorVariant === 'primary-bg',
					// success-bg
					'bg-success text-on-dark border-success':
						colorVariant === 'success-bg',
					// attention-bg
					'bg-attention text-on-dark border-attention':
						colorVariant === 'attention-bg',
					// negative-bg
					'bg-negative text-on-dark border-negative':
						colorVariant === 'negative-bg',
					// stage-in-review-bg
					'bg-stage-in-review text-on-dark border-stage-in-review':
						colorVariant === 'stage-in-review-bg',
				};
			} else {
				classes.push('pkpBadge');

				if (this.isButton) {
					classes.push('pkpBadge--button');
				}
			}

			if (this.isPrimary) {
				classes.push('pkpBadge--isPrimary');
			}
			if (this.isSuccess) {
				classes.push('pkpBadge--isSuccess');
			}
			if (this.isWarnable) {
				classes.push('pkpBadge--isWarnable');
			}
			if (this.hasDot || this.stage) {
				classes.push('pkpBadge--dot');
			}
			if (this.stage) {
				classes.push('pkpBadge--' + this.stage);
			}

			return classes;
		},
	},
	methods: {
		click() {
			this.$emit('click');
		},
	},
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpBadge {
	display: inline-block;
	padding: 0.25em 1em;
	font-size: @font-tiny;
	font-weight: @normal;
	line-height: 1.5em;
	border: 1px solid @bg-border-color-light;
	border-radius: 1.2em;
	color: @text;
}

.pkpBadge--isPrimary {
	border-color: @primary;
	background-color: @primary;
	color: #fff;

	&:before {
		border-color: #fff;
	}

	&.pkpBadge--button {
		&:hover,
		&:focus {
			background: transparent;
			border-color: @primary;
			color: @primary;

			&:before {
				border-color: @primary;
			}
		}
	}
}

.pkpBadge--isSuccess {
	border-color: @yes;
	background-color: @yes;
	color: #fff;

	&:before {
		border-color: #fff;
	}

	&.pkpBadge--button {
		&:hover,
		&:focus {
			background: transparent;
			border-color: @yes;
			color: @yes;

			&:before {
				border-color: @yes;
			}
		}
	}
}

.pkpBadge--isWarnable {
	border-color: @no;
	background-color: @no;
	color: #fff;

	&:before {
		border-color: #fff;
	}

	&.pkpBadge--button {
		&:hover,
		&:focus {
			background: transparent;
			border-color: @no;
			color: @no;

			&:before {
				border-color: @no;
			}
		}
	}
}

.pkpBadge--button {
	background: inherit;
	text-decoration: none;
	cursor: pointer;

	&:hover,
	&:focus {
		background: @primary;
		color: #fff;
		border-color: @primary;
		outline: 0;

		&:before {
			border-color: #fff;
		}
	}
}

.pkpBadge--dot {
	position: relative;
	padding-inline-start: 2em;

	&:before {
		content: '';
		position: absolute;
		top: 50%;
		left: 0.75em;
		transform: translateY(-50%);
		width: 10px;
		height: 10px;
		border: 2px solid;
		border-radius: 50%;
	}
}

.pkpBadge--submission {
	border-color: @submission;

	&:before {
		border-color: @submission;
	}

	&:hover,
	&:focus {
		background: @submission;
		border-color: @submission;

		&:before {
			border-color: #fff;
		}
	}
}

.pkpBadge--review {
	border-color: @review;

	&:before {
		border-color: @review;
	}

	&:hover,
	&:focus {
		background: @review;
		border-color: @review;

		&:before {
			border-color: #fff;
		}
	}
}

.pkpBadge--copyediting {
	border-color: @copyediting;

	&:before {
		border-color: @copyediting;
	}

	&:hover,
	&:focus {
		background: @copyediting;
		border-color: @copyediting;

		&:before {
			border-color: #fff;
		}
	}
}

.pkpBadge--production {
	border-color: @production;

	&:before {
		border-color: @production;
	}

	&:hover,
	&:focus {
		background: @production;
		border-color: @production;

		&:before {
			border-color: #fff;
		}
	}
}

[dir='rtl'] {
	.pkpBadge--dot {
		&:before {
			left: auto;
			right: 0.75em;
		}
	}
}
</style>
