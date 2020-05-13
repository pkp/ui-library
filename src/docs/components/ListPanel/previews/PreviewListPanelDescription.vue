<template>
	<list-panel :items="items" class="previewListPanelDescription">
		<template slot="header">
			<pkp-header>
				<h2>ListPanel with Description</h2>
			</pkp-header>
			<p>
				This is an example of description text that can be displayed with the
				panel. This is an example of description text that can be displayed with
				the panel.
			</p>
		</template>
	</list-panel>
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
			items: [...items]
		};
	}
};
</script>

<style lang="less">
@import '../../../../styles/_import';

.previewListPanelDescription .listPanel__header p {
	margin: 0;
}
</style>
