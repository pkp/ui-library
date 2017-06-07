<template>
	<li class="pkpListPanelItem pkpListPanelItem--select" :class="{'--hasFocus': isFocused}">
		<div class="pkpListPanelItem__selectItem" @click.prevent="toggleSelection">
			<input type="checkbox" :id="inputId" :name="inputName" :value="inputValue" v-model="selected" @click.stop @focus="focusItem" @blur="blurItem">
		</div>
		<label :for="inputId" class="pkpListPanelItem__item pkpListPanelItem__item--select">
			{{ item.title }}
		</label>
	</li>
</template>

<script>
import ListPanelItem from './ListPanelItem.vue';

export default {
	extends: ListPanelItem,
	name: 'SelectSubmissionsListItem',
	props: ['submission', 'i18n', 'inputName'],
	data: function () {
		return {
			selected: false,
		};
	},
	computed: {
		/**
		 * The input value to use for this item
		 *
		 * @return string
		 */
		inputValue: function () {
			return this.id;
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
			this.selected = !this.selected;
		},
	},
};
</script>

<style lang="less">
@import '../../styles/_config';

.pkpListPanelItem--select {
	padding: 0;

	&.--hasFocus {

		&:before {
			height: 100%;
			opacity: 1;
		}
	}
}

.pkpListPanelItem__selectItem {
	position: absolute;
	top: 0;
	left: 0;
	width: 4em;
	height: 100%;
	background: transparent;
	border: none;
	border-right: @grid-border;
	cursor: pointer;

	input {
		position: absolute;
		top: 50%;
		left: 50%;
		margin: 0;
		transform: translate(-50%, -50%);
		cursor: pointer;
	}
}

.pkpListPanelItem__item--select {
	display: block;
	padding: 1em 5em 1em;
	width: 100%;
	float: none;
	cursor: pointer;
}
</style>
