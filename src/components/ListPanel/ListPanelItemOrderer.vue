<template>
	<div class="pkpListPanelItem__orderer">
		<button tabindex="-1" class="pkpListPanelItem__ordererDragDrop">
			<icon icon="sort" />
		</button>
		<button class="pkpListPanelItem__ordererUp" @click.prevent="orderUp">
			<icon icon="angle-up" />
			<span class="-screenReader">{{ __('itemOrdererUp', {itemTitle: itemTitle}) }}</span>
		</button>
		<button class="pkpListPanelItem__ordererDown" @click.prevent="orderDown">
			<icon icon="angle-down" />
			<span class="-screenReader">{{ __('itemOrdererDown', {itemTitle: itemTitle}) }}</span>
		</button>
	</div>
</template>

<script>
import Icon from '@/components/Icon/Icon.vue';

export default {
	name: 'ListPanelItemOrderer',
	components: {
		Icon,
	},
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

	.fa {
		font-size: 20px;
		font-weight: @bold;
	}
}

.pkpListPanelItem__ordererUp {
	right: 4em;
}
</style>
