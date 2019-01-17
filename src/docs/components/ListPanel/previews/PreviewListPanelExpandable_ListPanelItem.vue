<template>
	<li class="pkpListPanelItem pkpListPanelItem--hasSummary">
		<div class="pkpListPanelItem__summary">
			<div class="pkpListPanelItem__item">
				{{ item.title }}
			</div>
			<button
				@click="toggleExpanded"
				class="pkpListPanelItem__expander"
			>
				<icon v-if="isExpanded" icon="angle-up" />
				<icon v-else icon="angle-down" />
				<span v-if="isExpanded" class="-screenReader">{{ __('viewLess', {name: item.title}) }}</span>
				<span v-else class="-screenReader">{{ __('viewMore', {name: item.title}) }}</span>
			</button>
		</div>
		<div
			v-if="isExpanded"
			class="pkpListPanelItem__details"
		>
			Here are the expanded details about this item.
		</div>
	</li>
</template>

<script>
import ListPanelItem from '@/components/ListPanel/ListPanelItem.vue';
import Icon from '@/components/Icon/Icon.vue';

export default {
	extends: ListPanelItem,
	name: 'ExpandableListPanelItem',
	components: {
		Icon
	},
	data: function() {
		return {
			isExpanded: false
		};
	}
};
</script>
