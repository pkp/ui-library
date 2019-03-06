<template>
	<div class="pkpListPanel pkpListPanel--select">
		<div class="pkpListPanel__header -pkpClearfix">
			<div class="pkpListPanel__title">{{ i18n.title }}</div>
		</div>
		<div class="pkpListPanel__body -pkpClearfix">
			<list-panel-notice
				v-if="i18n.notice"
				:notice="i18n.notice"
			/>
			<select-list-panel-select-all
				v-if="showSelectAll"
				:label="i18n.selectAllLabel"
				:checked="selectAllChecked"
				@toggle="toggleSelectAll"
			/>
			<div class="pkpListPanel__content">
				<ul class="pkpListPanel__items" aria-live="polite">
					<select-list-panel-item
						v-for="item in items"
						:key="item.id"
						:item="item"
						:inputName="inputName"
						:inputType="inputType"
						:selected="selected"
						@toggle="toggleItemSelection"
					/>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import ListPanelNotice from '@/components/ListPanel/ListPanelNotice.vue';
import SelectListPanelItem from '@/components/SelectListPanel/SelectListPanelItem.vue';
import SelectListPanelSelectAll from '@/components/SelectListPanel/SelectListPanelSelectAll.vue';

export default {
	extends: ListPanel,
	name: 'SelectListPanel',
	components: {
		ListPanelNotice,
		SelectListPanelItem,
		SelectListPanelSelectAll
	},
	data: function() {
		return {
			inputName: '',
			inputType: 'checkbox',
			selected: [],
			showSelectAll: false,
			initializeAllSelected: false
		};
	},
	computed: {
		/**
		 * Are all items selected?
		 *
		 * @return bool
		 */
		selectAllChecked: function() {
			return this.items.length && this.selected.length === this.items.length;
		}
	},
	methods: {
		/**
		 * Select or de-select an item in the list
		 *
		 * @param int|string Input value for the item in the list.
		 */
		toggleItemSelection: function(val) {
			if (this.inputType === 'radio') {
				this.selected = [val];
			} else {
				let index = this.selected.indexOf(val);
				if (index > -1) {
					this.selected.splice(index, 1);
				} else {
					this.selected.push(val);
				}
			}
		},

		/**
		 * Select or de-select all items in the list
		 */
		toggleSelectAll: function() {
			if (this.selectAllChecked) {
				this.selectNone();
			} else {
				this.selectAll();
			}
		},

		/**
		 * Select all items in the list
		 */
		selectAll: function() {
			this.selected = this.items.map(item => item.id);
		},

		/**
		 * De-select all items in the list
		 */
		selectNone: function() {
			this.selected = [];
		}
	},
	created: function() {
		/**
		 * Mark all items as selected when a flag is passed.
		 */
		if (this.initializeAllSelected) {
			this.selectAll();
		}
	}
};
</script>

<style lang="less">
@import '../../styles/_import';

/* Override form base font size */
.pkp_form .pkpListPanel__title {
	font-size: @font-base;
	line-height: @double;
}

/* Override form styles on labels */
.pkp_form label.pkpListPanelItem__item {
	font-size: @font-sml;
}
</style>
