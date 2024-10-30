<template>
	<div class="orderer">
		<span v-if="isDraggable" class="orderer__dragDrop" aria-hidden="true">
			<Icon icon="Sort" class="h-5 w-5" />
		</span>
		<button class="orderer__up" @click.prevent="up">
			<Icon icon="ChevronUp" class="h-5 w-5" />
			<span class="-screenReader">
				{{ t('common.orderUp', {itemTitle: itemTitle}) }}
			</span>
		</button>
		<button class="orderer__down" @click.prevent="down">
			<Icon icon="ChevronDown" class="h-5 w-5" />
			<span class="-screenReader">
				{{ t('common.orderDown', {itemTitle: itemTitle}) }}
			</span>
		</button>
	</div>
</template>

<script>
import Icon from '@/components/Icon/Icon.vue';

export default {
	name: 'Orderer',
	components: {Icon},
	props: {
		/** A unique id for the item to be ordered. This will be emitted in the `up` and `down` events. It may be a string or number, and does not correspond to the item's order in the list.  */
		itemId: [String, Number],
		/** The name of the item. This is used in an accessible label for the up and down buttons. */
		itemTitle: String,
		/** Whether or not to provide drag-and-drop controls for this item. When `isDraggable` is true, the items to be ordered must be wrapped in a `<Draggable>` component. */
		isDraggable: {
			type: Boolean,
			default: true,
		},
	},
	emits: [
		/** This event will be emitted when the up arrow is pressed on an item. The value will be the item's `id`.  */
		'up',
		/** This event will be emitted when the down arrow is pressed on an item. The value will be the item's `id`. */
		'down',
	],
	methods: {
		/**
		 * Emit an event to move this item up
		 */
		up() {
			this.$emit('up', this.itemId);
			this.$nextTick(() => {
				this.setFocus('up');
			});
		},

		/**
		 * Emit an event to move this item down
		 */
		down() {
			this.$emit('down', this.itemId);
			this.$nextTick(() => {
				this.setFocus('down');
			});
		},

		/**
		 * Set the focus on one of the up/down buttons
		 */
		setFocus: function (dir) {
			const selector = dir === 'up' ? '.orderer__up' : '.orderer__down';
			this.$el.querySelector(selector).focus();
		},
	},
};
</script>

<style lang="less">
@import '../../styles/_import';

.orderer__dragDrop,
.orderer__up,
.orderer__down {
	position: absolute;
	top: 0;
	left: 0;
	width: 3rem;
	height: 100%;
	background: transparent;
	border: none;

	&:focus {
		outline: 0;
	}

	span {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
}

.orderer__dragDrop {
	color: @primary;
	border-inline-end: @grid-border;
	cursor: move;
}

.orderer__up,
.orderer__down {
	left: auto;
	right: 0;
	color: @text-light;
	border-inline-start: @grid-border;
	cursor: pointer;

	&:hover {
		color: @primary;
		box-shadow: 0 2px 0 @primary;
	}

	&:focus {
		background: @bg-light;
	}
}

.orderer__up {
	right: 3rem;
}

[dir='rtl'] {
	.orderer__dragDrop {
		right: 0;
		left: auto;
	}

	.orderer__up,
	.orderer__down {
		right: auto;
		left: 0;
	}

	.orderer__down {
		left: 3rem;
	}
}
</style>
