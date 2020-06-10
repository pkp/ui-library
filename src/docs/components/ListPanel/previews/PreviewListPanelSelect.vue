<template>
	<fieldset class="previewListPanelSelect">
		<legend class="-screenReader">List Panel with Select</legend>
		<list-panel :items="items">
			<template slot="header">
				<pkp-header>
					<h2>List Panel with Select</h2>
				</pkp-header>
				<div v-if="canSelectAll" class="listPanel__selectAllWrapper">
					<input
						type="checkbox"
						:id="id + '-selectAll'"
						:checked="isSelectAllOn"
						@click="toggleSelectAll"
					/>
					<label class="listPanel__selectAllLabel" :for="id + '-selectAll'">
						Select All
					</label>
				</div>
			</template>
			<template v-slot:item="{item}">
				<div class="listPanel__itemSummary">
					<label class="listPanel__selectWrapper">
						<div class="listPanel__selector">
							<input
								type="checkbox"
								name="submissions[]"
								:value="item.id"
								v-model="selected"
							/>
						</div>
						<div class="listPanel__itemIdentity">
							<div class="listPanel__itemTitle">
								{{ item.title }}
							</div>
							<div class="listPanel__itemSubTitle">
								{{ item.subtitle }}
							</div>
						</div>
					</label>
				</div>
			</template>
		</list-panel>
	</fieldset>
</template>

<script>
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import PkpHeader from '@/components/Header/Header.vue';
import items from '../helpers/items';

export default {
	components: {
		ListPanel,
		PkpHeader
	},
	data() {
		return {
			id: 'previewListPanelSelect',
			canSelectAll: true,
			isSelectAllOn: false,
			items: [...items],
			selected: []
		};
	},
	methods: {
		toggleSelectAll() {
			if (this.isSelectAllOn) {
				this.selected = [];
			} else {
				this.selected = this.items.map(i => i.id);
			}
		}
	},
	watch: {
		selected(newVal, oldVal) {
			this.isSelectAllOn =
				this.selected.length && this.selected.length === this.items.length;
		}
	}
};
</script>

<style lang="less">
@import '../../../../styles/_import';

.previewListPanelSelect {
	border: none;
	padding: 0;

	.listPanel__selectAllWrapper {
		display: flex;
		align-items: center;
		margin-top: 1rem;
		margin-left: -0.5rem;
		line-height: 1.5rem;

		> input {
			margin-left: 0.5rem;
		}
	}

	.listPanel__selectAllLabel {
		margin-left: 0.5rem;
	}

	.listPanel__selectWrapper {
		display: flex;
		align-items: center;
		margin-left: -1rem;
	}

	.listPanel__selector {
		width: 3rem;
		padding-left: 1rem;
	}
}
</style>
