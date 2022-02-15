<template>
	<doi-list-panel-o-j-s
		apiUrl="http://httpbin.org/get"
		doiApiUrl="http://httpbin.org/get"
		executeActionApiUrl="http://httpbin.org/get"
		id="previewDoiListPanel--articles"
		:filters="[]"
		:items="items"
		:itemsMax="itemsMax"
		:itemType="'issue'"
		title="Article DOIs"
		:registration-agency-info="registrationAgencyInfo"
		:enabledDoiTypes="['article', 'issue', 'galley']"
		:doi-prefix="'10.1234'"
	/>
</template>

<script>
import DoiListPanelOJS from '@/components/ListPanel/doi/DoiListPanelOJS';
// import submissions from '@/docs/data/submissions';
import issues from '@/docs/data/issues';

export default {
	name: 'PreviewDoiListPanelOJS',
	components: {DoiListPanelOJS},
	data() {
		return {
			items: [...issues],
			itemsMax: issues.length,
			registrationAgencyInfo: {
				isConfigured: true,
				displayName: 'Crossref',
				errorMessageKey: 'crossref_failedMsg',
				registeredMessageKey: null,
				errorMessagePreamble: 'Info about error message here',
				registeredMessagePreamble: null
			}
		};
	},
	created() {
		/**
		 * Add required locale keys
		 */
		pkp.localeKeys['publication.status.unpublished'] = 'Unpublished';
		pkp.localeKeys['publication.status.unpublished'] =
			'publication.status.unpublished';
		pkp.localeKeys['publication.status.published'] =
			'publication.status.published';
		pkp.localeKeys['manager.dois.actions.deposit.label'] =
			'manager.dois.actions.deposit.label';
		pkp.localeKeys['manager.dois.actions.deposit.prompt'] =
			'manager.dois.actions.deposit.prompt';
		pkp.localeKeys['manager.dois.actions.markRegistered.label'] =
			'manager.dois.actions.markRegistered.label';
		pkp.localeKeys['manager.dois.actions.markRegistered.prompt'] =
			'manager.dois.actions.markRegistered.prompt';
		pkp.localeKeys['manager.dois.actions.export.label'] =
			'manager.dois.actions.export.label';
		pkp.localeKeys['manager.dois.actions.export.prompt'] =
			'manager.dois.actions.export.prompt';
		pkp.localeKeys['manager.dois.registration.submittedDescription'] =
			'manager.dois.registration.submittedDescription';
		pkp.localeKeys['manager.dois.registration.notSubmittedDescription'] =
			'manager.dois.registration.notSubmittedDescription';
		pkp.localeKeys['manager.dois.registration.viewError'] =
			'manager.dois.registration.viewError';
		pkp.localeKeys['manager.dois.registration.viewError.title'] =
			'manager.dois.registration.viewError.title';
		pkp.localeKeys['manager.dois.registration.viewRecord'] =
			'manager.dois.registration.viewRecord';
		pkp.localeKeys['manager.dois.registration.viewRecord.title'] =
			'manager.dois.registration.viewRecord.title';
		pkp.localeKeys['manager.dois.registration.depositDois'] =
			'manager.dois.registration.depositDois';
		pkp.localeKeys['manager.dois.status.unregistered'] =
			'manager.dois.status.unregistered';
		pkp.localeKeys['manager.dois.status.submitted'] =
			'manager.dois.status.submitted';
		pkp.localeKeys['manager.dois.status.registered'] =
			'manager.dois.status.registered';
		pkp.localeKeys['manager.dois.status.error'] = 'manager.dois.status.error';
		pkp.localeKeys['manager.dois.status.stale'] = 'manager.dois.status.stale';
	}
};
</script>

<style scoped></style>
