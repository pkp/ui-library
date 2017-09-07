<template>
	<div class="pkpListPanelItem__orderer">
		<button tabindex="-1" class="pkpListPanelItem__ordererDragDrop">
			<span class="fa fa-sort" aria-hidden="true"></span>
		</button>
		<button class="pkpListPanelItem__ordererUp" @click.prevent="orderUp">
			<span class="fa fa-chevron-up" aria-hidden="true"></span>
			<span class="-screenReader">{{ __('itemOrdererUp', {itemTitle: itemTitle}) }}</span>
		</button>
		<button class="pkpListPanelItem__ordererDown" @click.prevent="orderDown">
			<span class="fa fa-chevron-down" aria-hidden="true"></span>
			<span class="-screenReader">{{ __('itemOrdererDown', {itemTitle: itemTitle}) }}</span>
		</button>
	</div>
</template>

<script>
export default {
	name: 'ListPanelItemOrderer',
	props: ['i18n', 'itemTitle'],
	methods: {
		/**
		 * Emit an event to move this item up
		 */
		orderUp: function () {
			this.$emit('itemOrderUp');
		},

		/**
		 * Emit an event to move this item down
		 */
		orderDown: function () {
			this.$emit('itemOrderDown');
		},

		/**
		 * Set the focus on one of the up/down buttons
		 */
		setFocus: function (dir) {
			var selector = dir === 'up' ? '.pkpListPanelItem__ordererUp' : '.pkpListPanelItem__ordererDown';
			this.$el.querySelector(selector).focus();
		},
	},
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpListPanelItem__ordererDragDrop,
.pkpListPanelItem__ordererUp,
.pkpListPanelItem__ordererDown {
	position: absolute;
	top: 0;
	left: 0;
	width: 4em;
	height: 100%;
	text-align: center;
	background: transparent;
	border: none;

	&:focus {
		outline: 0;
	}
}

.pkpListPanelItem__ordererDragDrop {
	color: @primary;
	border-right: @grid-border;
	cursor: move;
}

.pkpListPanelItem__ordererUp,
.pkpListPanelItem__ordererDown {
	left: auto;
	right: 0;
	color: @text-light;
	border-left: @grid-border;
	cursor: pointer;

	&:hover {
		color: @primary;
		box-shadow: 0 2px 0 @primary;
	}

	&:focus {
		background: @bg-light;
	}
}

.pkpListPanelItem__ordererUp {
	right: 4em;
}
</style>
