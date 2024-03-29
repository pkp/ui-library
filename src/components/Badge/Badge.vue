<template>
	<button
		v-if="isButton"
		class="pkpBadge pkpBadge--button"
		:class="classes"
		@click="click"
	>
		<slot />
		<span v-if="label" class="-screenReader">{{ label }}</span>
	</button>
	<span v-else class="pkpBadge" :class="classes">
		<slot />
		<span v-if="label" class="-screenReader">{{ label }}</span>
	</span>
</template>

<script>
export default {
	name: 'Badge',
	props: {
		/** A hidden label for users without sight */
		label: String,
		/** Badges which should stand out from adjacent badges */
		isPrimary: Boolean,
		/** Badges which describe a successful or complete state */
		isSuccess: Boolean,
		/** Badges which describe an alert or warning */
		isWarnable: Boolean,
		isError: Boolean,
		/** If the badge can be used to perform an action, set this to true */
		isButton: Boolean,
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
