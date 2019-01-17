<template>
	<button v-if="isButton"
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
	props: ['label', 'isPrimary', 'isWarnable', 'isButton', 'hasDot', 'stage'],
	computed: {
		classes: function() {
			let classes = [];
			if (this.isPrimary) {
				classes.push('pkpBadge--isPrimary');
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
		}
	},
	methods: {
		click: function() {
			this.$emit('click');
		}
	}
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpBadge {
	display: inline-block;
	padding: 0 1em;
	font-size: @font-tiny;
	line-height: 2em;
	border: 1px solid @bg-border-color-light;
	border-radius: 1.2em;
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
	padding-left: 2em;

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
</style>
