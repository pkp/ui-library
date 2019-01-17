<template>
	<div class="pkpListPanel__selectAll">
		<div class="pkpListPanelItem__selectItem" @click.self="toggle">
			<input
				type="checkbox"
				class="pkpListPanel__selectAllInput"
				v-model="isChecked"
				:id="inputId"
				@change="toggle"
			>
		</div>
		<label :for="inputId" class="-screenReader" @click.self="toggle">
			{{ label }}
		</label>
	</div>
</template>

<script>
export default {
	name: 'SelectListPanelSelectAll',
	props: ['label', 'checked'],
	computed: {
		/**
		 * Unique input id
		 *
		 * @return string
		 */
		inputId: function() {
			return 'SelectListPanelSelectAll-' + this._uid;
		},

		/**
		 * Map the checked prop to a computed value
		 *
		 * @return boolean
		 */
		isChecked: function() {
			return this.checked;
		}
	},
	methods: {
		/**
		 * Emit an event to select or de-select all items
		 */
		toggle: function() {
			this.$emit('toggle');
		}
	}
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpListPanel__selectAll {
	position: relative;
	min-height: 3rem;
	background: @bg-light;

	.pkpListPanelItem__selectItem {
		border-right: none;
	}
}
</style>
