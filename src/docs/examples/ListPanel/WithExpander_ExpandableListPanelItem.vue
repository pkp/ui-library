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
				<template v-if="isExpanded">
					<span class="fa fa-angle-up" aria-hidden="true"></span>
					<span class="-screenReader">{{ i18n.viewMore }}</span>
				</template>
				<template v-else>
					<span class="fa fa-angle-down" aria-hidden="true"></span>
					<span class="-screenReader">{{ i18n.viewLess }}</span>
				</template>
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

export default {
	extends: ListPanelItem,
	name: 'WithExpander_ExpandableListPanelItem',
	props: ['item', 'i18n'],
	data: function () {
		return {
			isExpanded: false,
		};
	},
};
</script>
