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
				});
			}
			return {
				args,
				openDeleteDialog,
			};
		},
		template: `

			<div class="previewActionPanel">
				<action-panel>
					<h2 id="delete-title">Delete Incomplete Submissions</h2>
					<p id="delete-description">
						Delete all incomplete submissions that have not been modified in the
						last month.
					</p>
					<template #actions>
						<pkp-button
							:is-warnable="true"
							aria-describedby="delete-title delete-description"
							@click="openDeleteDialog"
						>
							Delete All
						</pkp-button>
					</template>
				</action-panel>
				<action-panel>
					<h2>Clear Cache</h2>
					<p id="delete-cache-description">
						Clear the cached data and templates across the site. This will effect
						cached values for all journals.
					</p>
					<template #actions>
						<pkp-button aria-describedby="delete-cache-description">
							Clear Data Cache
						</pkp-button>
						<pkp-button aria-describedby="delete-cache-description">
							Clear Template/CSS Cache
						</pkp-button>
						<pkp-button
							:is-warnable="true"
							aria-describedby="delete-cache-description"
						>
							Clear All Cache
						</pkp-button>
					</template>
				</action-panel>
				<action-panel>
					<h2 id="sessions-title">Expire User Sessions</h2>
					<p id="sessions-description">
						Immediately expire all user sessions. This will force all users to login
						again.
					</p>
					<template #actions>
						<pkp-button :is-warnable="true" aria-describedby="sessions-description">
							Expire Sessions
						</pkp-button>
					</template>
				</action-panel>
			</div>

		`,
	}),

	args: {},
};
