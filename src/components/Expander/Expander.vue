<template>
	<button @click="$emit('toggle')" class="expander">
		<icon v-if="isExpanded" icon="angle-up" />
		<icon v-else icon="angle-down" />
		<span v-if="isExpanded" class="-screenReader">
			{{ __('list.viewLess', {name: itemName}) }}
		</span>
		<span v-else class="-screenReader">
			{{ __('list.viewMore', {name: itemName}) }}
		</span>
	</button>
</template>

<script>
export default {
	props: {
		isExpanded: {
			type: Boolean,
			default() {
				return false;
			}
		},
		itemName: {
			type: String,
			required: true
		}
	}
};
</script>

<style lang="less">
@import '../../styles/_import';

.expander {
	width: 2rem;
	padding: 0 0.5em;
	background: transparent;
	border: @bg-border-light;
	border-radius: @radius;
	font-size: @font-sml;
	line-height: 2rem;
	color: @primary;
	box-shadow: 0 1px 0 @bg-border-color-light;
	cursor: pointer;

	&:hover,
	&:focus {
		color: @primary;
		border-color: @primary;
		outline: 0;
	}

	&:active {
		box-shadow: 0 0 2px;
	}
}
</style>
