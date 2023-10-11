<template>
	<highlights-list-panel
		apiUrl="https://httpbin.org"
		:form="form"
		i18nAdd="Add Highlight"
		i18nConfirmDelete="Are you sure you want to delete {$title}? This action can not be undone."
		i18nDelete="Delete Highlight"
		i18nEdit="Edit Highlight"
		i18nSaveOrder="Save Order"
		id="previewHighlightsListPanel"
		:items="items"
		:itemsMax="itemsMax"
		title="Highlights"
		@set="setData"
	/>
</template>
<script>
import HighlightsListPanel from '../../../../components/ListPanel/highlights/HighlightsListPanel.vue';
import highlight from '../../../data/highlight';
import form from '@/docs/components/Form/helpers/form-highlight';

export default {
	components: {
		HighlightsListPanel,
	},
	data() {
		const highlights = [
			{
				...highlight,
			},
			{
				...highlight,
				id: 2,
				title: {
					en: 'Eros in cursus turpis massa tincidunt dui ut ornare lectus',
					fr_CA: 'Eros in cursus turpis massa tincidunt dui ut ornare lectus',
					ar: 'Eros in cursus turpis massa tincidunt dui ut ornare lectus',
				},
				description: {
					en: 'Elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at turpis massa tincidunt dui ut ornare lectus',
					fr_CA:
						'Elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at turpis massa tincidunt dui ut ornare lectus',
					ar: 'Elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at turpis massa tincidunt dui ut ornare lectus',
				},
			},
			{
				...highlight,
				id: 3,
				title: {
					en: 'Risus feugiat in ante metus dictum at',
					fr_CA: 'Risus feugiat in ante metus dictum at',
					ar: 'Risus feugiat in ante metus dictum at',
				},
			},
			{
				...highlight,
				id: 4,
				title: {
					en: 'Morbi tincidunt ornare massa eget egestas purus viverra accumsan',
					fr_CA:
						'Morbi tincidunt ornare massa eget egestas purus viverra accumsan',
					ar: 'Morbi tincidunt ornare massa eget egestas purus viverra accumsan',
				},
			},
			{
				...highlight,
				id: 5,
				title: {
					en: 'Nibh praesent tristique magna sit amet purus gravida quis',
					fr_CA: 'Nibh praesent tristique magna sit amet purus gravida quis',
					ar: 'Nibh praesent tristique magna sit amet purus gravida quis',
				},
			},
		];

		return {
			form: {...form},
			items: [...highlights],
			itemsMax: highlights.length,
		};
	},
	methods: {
		setData(id, newData) {
			Object.keys(newData).forEach((key) => {
				if (this[key]) {
					this[key] = newData[key];
				}
			});
		},
	},
};
</script>
