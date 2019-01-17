<template>
	<li class="pkpListPanelItem pkpListPanelItem--select">
		<div class="pkpListPanelItem__selectItem" @click.self="toggle">
			<input
				v-if="inputType === 'radio'"
				type="radio"
				:id="inputId"
				:name="inputName"
				:value="inputValue"
				v-model="isSelected"
				@change="toggle"
				@focus="focusItem"
				@blur="blurItem"
			>
			<input
				v-else
				type="checkbox"
				:id="inputId"
				:name="inputName"
				:value="inputValue"
				v-model="isSelected"
				@change="toggle"
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
	props: ['item', 'inputName', 'inputType', 'selected'],
	computed: {
		/**
		 * Map the item id
		 */
		id: function() {
			return this.item.id;
		},

		/**
		 * The input value to use for this item
		 *
		 * @return string
		 */
		inputValue: function() {
			return this.id;
		},

		/**
		 * The id attribute of the checkbox
		 *
		 * @return string
		 */
		inputId: function() {
			return this.inputName + this.inputValue;
		},

		/**
		 * Is this item selected?
		 *
		 * @return bool
		 */
		isSelected: function() {
			return this.selected.indexOf(this.inputValue) > -1
				? this.inputValue
				: null;
		}
	},
	methods: {
		/**
		 * Emit an event to select or de-select this item
		 */
		toggle: function() {
			this.$emit('toggle', this.inputValue);
		}
	}
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
