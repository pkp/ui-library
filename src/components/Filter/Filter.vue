<template>
	<div :class="classes">
		<button
			class="pkpFilter__label"
			:class="{'-isActive': isFilterActive}"
			@click.prevent.stop="toggle(param, value)"
		>
			{{ title }}
		</button>
		<button
			v-if="isFilterActive"
			class="pkpFilter__remove"
			@click.prevent.stop="remove(param, value)"
		>
			<Icon icon="Cancel" class="h-4 w-4 text-negative" />
			<span class="-screenReader">
				{{ t('common.filterRemove', {filterTitle: title}) }}
			</span>
		</button>
	</div>
</template>

<script>
import Icon from '@/components/Icon/Icon.vue';

export default {
	components: {Icon},
	props: {
		/** Whether or not this is filter is currently on or off. */
		isFilterActive: {
			type: Boolean,
			default() {
				return false;
			},
		},
		/** The query parameter to use when submitting API requests for this filter. For example, a filter for getting all submissions in a particular stage would be `stageIds`. */
		param: {
			type: String,
			required: true,
		},
		/** The label for this filter. */
		title: {
			type: String,
			required: true,
		},
		/** The value to use when submitting API requests for this filter. For example, a filter for getting all submissions currently in the Submission stage would have a `param` of `stageIds` and a `value` of `1`. */
		value: {
			type: [String, Number, Boolean, Array, Object],
			required: true,
		},
	},
	emits: [
		/** Emitted when the filter is activated. Payload: `(param, value)` */
		'add-filter',
		/** Emitted when the filter is deactivated. Payload: `(param, value)` */
		'remove-filter',
	],
	computed: {
		/**
		 * Classes to apply to the root element
		 *
		 * @return {Array}
		 */
		classes() {
			let classes = ['pkpFilter'];
			if (!this.isFilterActive) {
				classes.push('pkpFilter--disabled');
			}
			return classes;
		},
	},
	methods: {
		/**
		 * Add or remove a filter
		 */
		toggle() {
			if (this.isFilterActive) {
				this.remove();
			} else {
				this.$emit('add-filter', this.param, this.value);
			}
		},

		/**
		 * Remove a filter
		 */
		remove() {
			this.$emit('remove-filter', this.param, this.value);
		},
	},
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpFilter {
	position: relative;
	font-size: @font-sml;
}

.pkpFilter__label {
	padding: 0.5rem 1rem;
	background: transparent;
	border: none;
	color: @primary;
	line-height: 1.2em;
	text-decoration: none;
	text-align: left;
	cursor: pointer;
	word-break: break-all;

	&:hover,
	&:focus {
		box-shadow: inset 2px 0 0 @primary;
		outline: 0;
	}

	&.-isActive {
		font-weight: @bold;
	}
}

.pkpFilter__add,
.pkpFilter__remove {
	position: absolute;
	top: 50%;
	right: 0;
	padding: 0;
	margin: 0;
	width: 2rem;
	border: none;
	transform: translateY(-50%);
	background: transparent;
	font-size: @font-base;
	text-align: center;
	color: @text-light;
	cursor: pointer;
}

.pkpFilter__remove {
	color: @offset;

	&:hover,
	&:focus {
		color: @offset;
	}
}

[dir='rtl'] {
	.pkpFilter__add,
	.pkpFilter__remove {
		right: auto;
		left: 0;
	}
}
</style>
