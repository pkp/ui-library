<template>
	<div class="pkpFilter">
		<button
			@click.prevent.stop="toggle(param, value)"
			class="pkpFilter__label"
			:class="{'-isActive': isFilterActive}"
		>
			{{ title }}
		</button>
		<button
			v-if="isFilterActive"
			class="pkpFilter__remove"
			@click.prevent.stop="remove(param, value)"
		>
			<icon icon="times-circle-o" />
			<span class="-screenReader">{{ __('filterRemove', {filterTitle: title}) }}</span>
		</button>
	</div>
</template>

<script>
import Icon from '@/components/Icon/Icon.vue';
export default {
	components: {
		Icon
	},
	props: {
		i18n: {
			type: Object,
			default() {
				return {};
			}
		},
		isFilterActive: {
			type: Boolean,
			default() {
				return false;
			}
		},
		param: {
			type: String,
			required: true
		},
		title: {
			type: String,
			required: true
		},
		value: {
			type: [String, Number, Boolean, Array, Object],
			required: true
		}
	},
	methods: {
		/**
		 * Add or remove a filter
		 *
		 * @param String param
		 * @param mixed value
		 */
		toggle: function(param, value) {
			if (this.isFilterActive) {
				this.remove(param, value);
			} else {
				this.$emit('add-filter', param, value);
			}
		},

		/**
		 * Remove a filter
		 *
		 * @param String param
		 * @param mixed value
		 */
		remove: function(param, value) {
			this.$emit('remove-filter', param, value);
		}
	}
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpFilter {
	position: relative;
}

.pkpFilter__label {
	padding: 0.5rem 1rem;
	background: transparent;
	border: none;
	color: @primary;
	line-height: 1.2em;
	text-decoration: none;
	cursor: pointer;

	&:hover,
	&:focus {
		box-shadow: inset 2px 0 0 @primary;
		outline: 0;
	}

	&.-isActive {
		font-weight: @bold;
	}
}

.pkpFilter__remove {
	position: absolute;
	top: 50%;
	right: 0;
	padding: 0;
	margin: 0;
	width: @double;
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
</style>
