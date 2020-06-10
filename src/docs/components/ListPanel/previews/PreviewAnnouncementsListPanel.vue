<template>
	<announcements-list-panel
		addAnnouncementLabel="Add Announcement"
		apiUrl=""
		confirmDeleteMessage="Are you sure you want to delete this announcement?"
		deleteAnnouncementLabel="Delete Announcement"
		editAnnouncementLabel="Edit Announcement"
		:form="form"
		id="previewAnnouncementsListPanel"
		:items="items"
		:itemsMax="itemsMax"
		title="Announcements"
		urlBase="https://example.com/announcement/view/__id__"
	/>
</template>
<script>
import AnnouncementsListPanel from '@/components/ListPanel/announcements/AnnouncementsListPanel.vue';
import announcement from '@/docs/data/announcement';
import form from '@/docs/components/Form/helpers/form-announcement';

export default {
	components: {
		AnnouncementsListPanel
	},
	data() {
		const announcements = [
			{
				...announcement,
				...announcement,
				dateExpire: '2022-02-03',
				datePosted: '2020-01-29',
				id: 1,
				title: {
					en_US: 'Eros in cursus turpis massa tincidunt dui ut ornare lectus',
					fr_CA: 'Eros in cursus turpis massa tincidunt dui ut ornare lectus',
					ar_AR: 'Eros in cursus turpis massa tincidunt dui ut ornare lectus'
				}
			},
			{
				...announcement,
				dateExpire: '2021-12-08',
				datePosted: '2019-12-12',
				id: 2,
				title: {
					en_US:
						'Elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at turpis massa tincidunt dui ut ornare lectus',
					fr_CA:
						'Elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at turpis massa tincidunt dui ut ornare lectus',
					ar_AR:
						'Elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at turpis massa tincidunt dui ut ornare lectus'
				}
			},
			{
				...announcement,
				dateExpire: '2020-02-03',
				datePosted: '2019-11-09',
				id: 3,
				title: {
					en_US: 'Risus feugiat in ante metus dictum at',
					fr_CA: 'Risus feugiat in ante metus dictum at',
					ar_AR: 'Risus feugiat in ante metus dictum at'
				}
			},
			{
				...announcement,
				dateExpire: '2020-06-19',
				datePosted: '2019-09-21',
				id: 4,
				title: {
					en_US:
						'Morbi tincidunt ornare massa eget egestas purus viverra accumsan',
					fr_CA:
						'Morbi tincidunt ornare massa eget egestas purus viverra accumsan',
					ar_AR:
						'Morbi tincidunt ornare massa eget egestas purus viverra accumsan'
				}
			},
			{
				...announcement,
				dateExpire: '2019-12-03',
				datePosted: '2019-05-15',
				id: 5,
				title: {
					en_US: 'Nibh praesent tristique magna sit amet purus gravida quis',
					fr_CA: 'Nibh praesent tristique magna sit amet purus gravida quis',
					ar_AR: 'Nibh praesent tristique magna sit amet purus gravida quis'
				}
			}
		];

		return {
			form: {...form},
			items: [...announcements],
			itemsMax: announcements.length
		};
	}
};
</script>
