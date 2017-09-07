<template>
	<li class="pkpListPanelItem pkpListPanelItem--select">
		<div class="pkpListPanelItem__selectItem" @click.prevent="toggleSelection">
			<input
				v-if="inputType === 'radio'"
				type="radio"
				:id="inputId"
				:name="inputName"
				:value="inputValue"
				v-model="selected"
				@click.stop
				@focus="focusItem"
				@blur="blurItem"
			>
			<input
				v-else
				type="checkbox"
				:id="inputId"
				:name="inputName"
				:value="inputValue"
				v-model="selected"
				@click.stop
				@focus="focusItem"
				@blur="blurItem"
			>
		</div>
		<label :for="inputId" class="pkpListPanelItem__item">
			{{ item.title }}
		</label>
	</li>
</template>

<script>
import ListPanelItem from '@/components/ListPanel/ListPanelItem.vue';

export default {
	extends: ListPanelItem,
	name: 'SelectListPanelItem',
	props: ['item', 'inputName', 'inputType'],
	data: function () {
		return {
			selected: false,
		};
	},
	computed: {
		/**
		 * Map the item id
		 */
		id: function () {
			return this.item.id;
		},

		/**
		 * The input value to use for this item
		 *
		 * @return string
		 */
		inputValue: function () {
			return this.item.id;
		},

		/**
		 * The id attribute of the checkbox
		 *
		 * @return string
		 */
		inputId: function () {
			return this.inputName + this.inputValue;
		},
	},
	methods: {
		/**
		 * Toggle the checkbox when clicked
		 */
		toggleSelection: function (e) {
			if (this.inputType === 'radio') {
				this.selected = this.selected ? '' : this.inputValue;
			} else {
				this.selected = !this.selected;
			}
		},
	},
	created: function () {
		/**
		 * Set an item to selected when loaded
		 */
		if (this.item._initializeSelected) {
			this.selected = this.inputType === 'radio' ? this.inputValue : true;
		}
	},
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpListPanelItem--select {
	position: relative;
	padding-top: 0;
	padding-bottom: 0;

	.pkpListPanelItem__item {
		display: block;
		padding-top: 1rem;
		padding-bottom: 1rem;
		padding-left: 4rem;
		font-weight: @normal;
		cursor: pointer;
	}
}

.pkpListPanelItem__selectItem {
	position: absolute;
	top: 0;
	left: 0;
	width: 4rem;
	height: 100%;
	background: transparent;
	border: none;
	border-right: @grid-border;
	cursor: pointer;

	input {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		cursor: pointer;
	}
}
</style>
