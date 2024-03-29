import AnnouncementsListPanel from './AnnouncementsListPanel.vue';

import AnnouncementMock from '@/mocks/announcement';
import FormAnnouncementMock from '@/components/Form/mocks/form-announcement';

export default {
	title: 'ListPanel/AnnouncementsListPanel',
	component: AnnouncementsListPanel,
};

const announcements = [
	{
		...AnnouncementMock,
		dateExpire: '2022-02-03',
		datePosted: '2020-01-29',
		id: 1,
		title: {
			en: 'Eros in cursus turpis massa tincidunt dui ut ornare lectus',
			fr_CA: 'Eros in cursus turpis massa tincidunt dui ut ornare lectus',
			ar: 'Eros in cursus turpis massa tincidunt dui ut ornare lectus',
		},
	},
	{
		...AnnouncementMock,
		dateExpire: '2021-12-08',
		datePosted: '2019-12-12',
		id: 2,
		title: {
			en: 'Elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at turpis massa tincidunt dui ut ornare lectus',
			fr_CA:
				'Elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at turpis massa tincidunt dui ut ornare lectus',
			ar: 'Elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at turpis massa tincidunt dui ut ornare lectus',
		},
	},
	{
		...AnnouncementMock,
		dateExpire: '2020-02-03',
		datePosted: '2019-11-09',
		id: 3,
		title: {
			en: 'Risus feugiat in ante metus dictum at',
			fr_CA: 'Risus feugiat in ante metus dictum at',
			ar: 'Risus feugiat in ante metus dictum at',
		},
	},
	{
		...AnnouncementMock,
		dateExpire: '2020-06-19',
		datePosted: '2019-09-21',
		id: 4,
		title: {
			en: 'Morbi tincidunt ornare massa eget egestas purus viverra accumsan',
			fr_CA: 'Morbi tincidunt ornare massa eget egestas purus viverra accumsan',
			ar: 'Morbi tincidunt ornare massa eget egestas purus viverra accumsan',
		},
	},
	{
		...AnnouncementMock,
		dateExpire: '2019-12-03',
		datePosted: '2019-05-15',
		id: 5,
		title: {
			en: 'Nibh praesent tristique magna sit amet purus gravida quis',
			fr_CA: 'Nibh praesent tristique magna sit amet purus gravida quis',
			ar: 'Nibh praesent tristique magna sit amet purus gravida quis',
		},
	},
];

export const Base = {
	render: (args) => ({
		components: {AnnouncementsListPanel},
		setup() {
			return {args};
		},
		template: `
			<AnnouncementsListPanel
				v-bind="args"
			/>
		`,
	}),

	args: {
		form: {...FormAnnouncementMock},
		items: [...announcements],
		itemsMax: announcements.length,
		title: 'Announcements',
		urlBase: 'https://example.com/announcement/view/__id__',
		id: 'previewAnnouncementsListPanel',
		addAnnouncementLabel: 'Add Announcement',
		apiUrl: '',
		confirmDeleteMessage: 'Are you sure you want to delete this announcement?',
		deleteAnnouncementLabel: 'Delete Announcement',
		editAnnouncementLabel: 'Edit Announcement',
	},
};
