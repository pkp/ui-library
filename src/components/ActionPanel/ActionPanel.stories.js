import ActionPanel from './ActionPanel.vue';
import './ActionPanelStories.less';
import {useLocalize} from '@/composables/useLocalize';
import {useModalStore} from '@/stores/modalStore';
export default {
	title: 'Components/ActionPanel',
	component: ActionPanel,
};

export const Default = {
	render: (args) => ({
		components: {ActionPanel},
		setup() {
			const {t} = useLocalize();
			const modalStore = useModalStore();

			function openDeleteDialog() {
				modalStore.openDialog({
					name: 'deleteDialog',
					title: 'Delete Incomplete Submissions',
					message:
						'Are you sure you want to delete 35 submissions? This action can not be undone.',
					actions: [
						{
							label: 'Delete',
							isWarnable: true,
							callback: (close) => {
								setTimeout(() => {
									close();
								}, 1000);
							},
						},
						{
							label: t('common.cancel'),
							callback: (close) => close(),
						},
					],
					modalStyle: 'negative',
				});
			}
			return {
				args,
				openDeleteDialog,
			};
		},
		template: `

			<div class="previewActionPanel">
				<ActionPanel>
					<h2 id="delete-title">Delete Incomplete Submissions</h2>
					<p id="delete-description">
						Delete all incomplete submissions that have not been modified in the
						last month.
					</p>
					<template #actions>
						<PkpButton
							:is-warnable="true"
							aria-describedby="delete-title delete-description"
							@click="openDeleteDialog"
						>
							Delete All
						</PkpButton>
					</template>
				</ActionPanel>
				<ActionPanel>
					<h2>Clear Cache</h2>
					<p id="delete-cache-description">
						Clear the cached data and templates across the site. This will effect
						cached values for all journals.
					</p>
					<template #actions>
						<PkpButton aria-describedby="delete-cache-description">
							Clear Data Cache
						</PkpButton>
						<PkpButton aria-describedby="delete-cache-description">
							Clear Template/CSS Cache
						</PkpButton>
						<PkpButton
							:is-warnable="true"
							aria-describedby="delete-cache-description"
						>
							Clear All Cache
						</PkpButton>
					</template>
				</ActionPanel>
				<ActionPanel>
					<h2 id="sessions-title">Expire User Sessions</h2>
					<p id="sessions-description">
						Immediately expire all user sessions. This will force all users to login
						again.
					</p>
					<template #actions>
						<PkpButton :is-warnable="true" aria-describedby="sessions-description">
							Expire Sessions
						</PkpButton>
					</template>
				</ActionPanel>
			</div>

		`,
	}),

	args: {},
};
