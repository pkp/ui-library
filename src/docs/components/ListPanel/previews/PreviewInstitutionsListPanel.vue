<template>
	<institutions-list-panel
		addInstitutionLabel="Add Institution"
		apiUrl=""
		confirmDeleteMessage="Are you sure you want to delete this institution?"
		deleteInstitutionLabel="Delete Institution"
		editInstitutionLabel="Edit Institution"
		:form="form"
		id="previewInstitutionsListPanel"
		:items="items"
		:itemsMax="itemsMax"
		title="Institutions"
		urlBase="https://example.com/institution/view/__id__"
	/>
</template>
<script>
import InstitutionsListPanel from '@/components/ListPanel/institutions/InstitutionsListPanel.vue';
import form from '@/docs/components/Form/helpers/form-institution';

export default {
	components: {
		InstitutionsListPanel,
	},
	data() {
		const institutions = [
			{
				id: 1,
				name: {
					en: 'Institution 1 Name EN',
					fr_CA: 'Institution 1 Name FR',
					ar: 'Institution 1 Name AR',
				},
				ipRanges: ['142.60.*.*'],
			},
			{
				id: 2,
				name: {
					en: 'Institution 2 Name EN',
					fr_CA: 'Institution 2 Name FR',
					ar: 'Institution 2 Name AR',
				},
				ipRanges: ['142.58.103.1 - 142.58.103.4', '142.59.*.*'],
			},
			{
				id: 3,
				name: {
					en: 'Institution 3 Name EN',
					fr_CA: 'Institution 3 Name FR',
					ar: 'Institution 3 Name AR',
				},
			},
			{
				id: 4,
				name: {
					en: 'Institution 4 Name EN',
					fr_CA: 'Institution 4 Name FR',
					ar: 'Institution 4 Name AR',
				},
			},
		];

		return {
			form: {...form},
			items: [...institutions],
			itemsMax: institutions.length,
		};
	},
};
</script>
