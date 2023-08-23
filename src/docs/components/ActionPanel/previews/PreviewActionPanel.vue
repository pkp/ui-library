<template>
	<div class="previewActionPanel">
		<action-panel>
			<h2 id="delete-title">Delete Incomplete Submissions</h2>
			<p id="delete-description">
				Delete all incomplete submissions that have not been modified in the
				last month.
			</p>
			<template slot="actions">
				<pkp-button
					:isWarnable="true"
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
			<template slot="actions">
				<pkp-button aria-describedby="delete-cache-description">
					Clear Data Cache
				</pkp-button>
				<pkp-button aria-describedby="delete-cache-description">
					Clear Template/CSS Cache
				</pkp-button>
				<pkp-button
					:isWarnable="true"
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
			<template slot="actions">
				<pkp-button :isWarnable="true" aria-describedby="sessions-description">
					Expire Sessions
				</pkp-button>
			</template>
		</action-panel>
	</div>
</template>

<script>
import ActionPanel from '../../../../components/ActionPanel/ActionPanel.vue';
import dialog from '../../../../mixins/dialog';

export default {
	components: {
		ActionPanel,
	},
	mixins: [dialog],
	methods: {
		openDeleteDialog() {
			this.openDialog({
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
						label: this.__('common.cancel'),
						callback: (close) => close(),
					},
				],
			});
		},
	},
};
</script>

<style lang="less">
@import '../../../../styles/_import';

.previewActionPanel .actionPanel {
	margin-bottom: 2rem;
}
</style>
