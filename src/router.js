import Vue from 'vue';
import Router from 'vue-router';
import Page from './docs/Page.vue';
import ComponentAnnouncementsListPanel from './docs/components/ListPanel/ComponentAnnouncementsListPanel.vue';
import ComponentBadge from './docs/components/Badge/ComponentBadge.vue';
import ComponentButton from './docs/components/Button/ComponentButton.vue';
import ComponentCatalogListPanel from './docs/components/ListPanel/ComponentCatalogListPanel.vue';
import ComponentChart from './docs/components/Chart/ComponentChart.vue';
import ComponentDateRange from './docs/components/DateRange/ComponentDateRange.vue';
import ComponentDoiListPanel from './docs/components/ListPanel/ComponentDoiListPanel';
import ComponentDoiListPanelOJS from '@/docs/components/ListPanel/ComponentDoiListPanelOJS';
import ComponentDropdown from './docs/components/Dropdown/ComponentDropdown.vue';
import ComponentEmailTemplatesListPanel from './docs/components/ListPanel/ComponentEmailTemplatesListPanel.vue';
import ComponentFilter from './docs/components/Filter/ComponentFilter.vue';
import ComponentFieldAutosuggestPreset from './docs/components/Form/fields/FieldAutosuggestPreset/ComponentFieldAutosuggestPreset.vue';
import ComponentFieldArchivingPn from './docs/components/Form/fields/FieldArchivingPn/ComponentFieldArchivingPn.vue';
import ComponentFieldBaseAutosuggest from './docs/components/Form/fields/FieldBaseAutosuggest/ComponentFieldBaseAutosuggest.vue';
import ComponentFieldBase from './docs/components/Form/fields/FieldBase/ComponentFieldBase.vue';
import ComponentFieldColor from './docs/components/Form/fields/FieldColor/ComponentFieldColor.vue';
import ComponentFieldPubId from './docs/components/Form/fields/FieldPubId/ComponentFieldPubId.vue';
import ComponentFieldHtml from './docs/components/Form/fields/FieldHtml/ComponentFieldHtml.vue';
import ComponentFieldMetadataSetting from './docs/components/Form/fields/FieldMetadataSetting/ComponentFieldMetadataSetting.vue';
import ComponentFieldOptions from './docs/components/Form/fields/FieldOptions/ComponentFieldOptions.vue';
import ComponentFieldRadioInput from './docs/components/Form/fields/FieldRadioInput/ComponentFieldRadioInput.vue';
import ComponentFieldRichTextarea from './docs/components/Form/fields/FieldRichTextarea/ComponentFieldRichTextarea.vue';
import ComponentFieldSelect from './docs/components/Form/fields/FieldSelect/ComponentFieldSelect.vue';
import ComponentFieldSelectIssue from './docs/components/Form/fields/FieldSelectIssue/ComponentFieldSelectIssue.vue';
import ComponentFieldShowEnsuringLink from './docs/components/Form/fields/FieldShowEnsuringLink/ComponentFieldShowEnsuringLink.vue';
import ComponentFieldText from './docs/components/Form/fields/FieldText/ComponentFieldText.vue';
import ComponentFieldTextarea from './docs/components/Form/fields/FieldTextarea/ComponentFieldTextarea.vue';
import ComponentFieldUpload from './docs/components/Form/fields/FieldUpload/ComponentFieldUpload.vue';
import ComponentFieldUploadImage from './docs/components/Form/fields/FieldUploadImage/ComponentFieldUploadImage.vue';
import ComponentForm from './docs/components/Form/ComponentForm.vue';
import ComponentHeader from './docs/components/Header/ComponentHeader.vue';
import ComponentHelpButton from './docs/components/HelpButton/ComponentHelpButton.vue';
import ComponentIcon from './docs/components/Icon/ComponentIcon.vue';
import ComponentList from './docs/components/List/ComponentList.vue';
import ComponentListPanel from './docs/components/ListPanel/ComponentListPanel.vue';
import ComponentModal from './docs/components/Modal/ComponentModal.vue';
import ComponentMultilingualProgress from './docs/components/MultilingualProgress/ComponentMultilingualProgress.vue';
import ComponentNotification from './docs/components/Notification/ComponentNotification.vue';
import ComponentNotify from './docs/utilities/Notify/ComponentNotify.vue';
import ComponentOrderer from './docs/components/Orderer/ComponentOrderer.vue';
import ComponentPage from './docs/components/Page/ComponentPage.vue';
import ComponentPagination from './docs/components/Pagination/ComponentPagination.vue';
import ComponentProgressBar from './docs/components/ProgressBar/ComponentProgressBar.vue';
import ComponentSearch from './docs/components/Search/ComponentSearch.vue';
import ComponentSelectReviewerListPanel from './docs/components/ListPanel/ComponentSelectReviewerListPanel.vue';
import ComponentSubmissionFilesListPanel from './docs/components/ListPanel/ComponentSubmissionFilesListPanel.vue';
import ComponentSubmissionsListPanel from './docs/components/ListPanel/ComponentSubmissionsListPanel.vue';
import ComponentSpinner from './docs/components/Spinner/ComponentSpinner.vue';
import ComponentStatsPage from './docs/components/StatsPage/ComponentStatsPage.vue';
import ComponentTable from './docs/components/Table/ComponentTable.vue';
import ComponentTabs from './docs/components/Tabs/ComponentTabs.vue';
import ComponentTooltip from './docs/components/Tooltip/ComponentTooltip.vue';
import ComponentWorkflowPage from './docs/components/WorkflowPage/ComponentWorkflowPage.vue';

Vue.use(Router);

export default new Router({
	base: process.env.BASE_URL,
	scrollBehavior(to, from, savedPosition) {
		return {x: 0, y: 0};
	},
	routes: [
		{
			path: '/',
			name: 'index',
			component: Page
		},
		{
			path: '/pages/:page?',
			name: 'page',
			component: Page
		},
		{
			path: '/component/Badge/:example?',
			name: 'Badge',
			component: ComponentBadge
		},
		{
			path: '/component/Button/:example?',
			name: 'Button',
			component: ComponentButton
		},
		{
			path: '/component/Chart/:example?',
			name: 'Chart',
			component: ComponentChart
		},
		{
			path: '/component/DateRange/:example?',
			name: 'DateRange',
			component: ComponentDateRange
		},
		{
			path: '/component/Dropdown/:example?',
			name: 'Dropdown',
			component: ComponentDropdown
		},
		{
			path: '/component/Filter/:example?',
			name: 'Filter',
			component: ComponentFilter
		},
		{
			path: '/component/Form/fields/FieldArchivingPn/:example?',
			name: 'Form/fields/FieldArchivingPn',
			component: ComponentFieldArchivingPn
		},
		{
			path: '/component/Form/fields/FieldAutosuggestPreset/:example?',
			name: 'Form/fields/FieldAutosuggestPreset',
			component: ComponentFieldAutosuggestPreset
		},
		{
			path: '/component/Form/fields/FieldBaseAutosuggest/:example?',
			name: 'Form/fields/FieldBaseAutosuggest',
			component: ComponentFieldBaseAutosuggest
		},
		{
			path: '/component/Form/fields/FieldBase/:example?',
			name: 'Form/fields/FieldBase',
			component: ComponentFieldBase
		},
		{
			path: '/component/Form/fields/FieldColor/:example?',
			name: 'Form/fields/FieldColor',
			component: ComponentFieldColor
		},
		{
			path: '/component/Form/fields/FieldPubId/:example?',
			name: 'Form/fields/FieldPubId',
			component: ComponentFieldPubId
		},
		{
			path: '/component/Form/fields/FieldHtml/:example?',
			name: 'Form/fields/FieldHtml',
			component: ComponentFieldHtml
		},
		{
			path: '/component/Form/fields/FieldMetadataSetting/:example?',
			name: 'Form/fields/FieldMetadataSetting',
			component: ComponentFieldMetadataSetting
		},
		{
			path: '/component/Form/fields/FieldOptions/:example?',
			name: 'Form/fields/FieldOptions',
			component: ComponentFieldOptions
		},
		{
			path: '/component/Form/fields/FieldRadioInput/:example?',
			name: 'Form/fields/FieldRadioInput',
			component: ComponentFieldRadioInput
		},
		{
			path: '/component/Form/fields/FieldRichTextarea/:example?',
			name: 'Form/fields/FieldRichTextarea',
			component: ComponentFieldRichTextarea
		},
		{
			path: '/component/Form/fields/FieldSelect/:example?',
			name: 'Form/fields/FieldSelect',
			component: ComponentFieldSelect
		},
		{
			path: '/component/Form/fields/FieldSelectIssue/:example?',
			name: 'Form/fields/FieldSelectIssue',
			component: ComponentFieldSelectIssue
		},
		{
			path: '/component/Form/fields/FieldShowEnsuringLink/:example?',
			name: 'Form/fields/FieldShowEnsuringLink',
			component: ComponentFieldShowEnsuringLink
		},
		{
			path: '/component/Form/fields/FieldText/:example?',
			name: 'Form/fields/FieldText',
			component: ComponentFieldText
		},
		{
			path: '/component/Form/fields/FieldTextarea/:example?',
			name: 'Form/fields/FieldTextarea',
			component: ComponentFieldTextarea
		},
		{
			path: '/component/Form/fields/FieldUpload/:example?',
			name: 'Form/fields/FieldUpload',
			component: ComponentFieldUpload
		},
		{
			path: '/component/Form/fields/FieldUploadImage/:example?',
			name: 'Form/fields/FieldUploadImage',
			component: ComponentFieldUploadImage
		},
		{
			path: '/component/Form/:example?',
			name: 'Form',
			component: ComponentForm
		},
		{
			path: '/component/Header/:example?',
			name: 'Header',
			component: ComponentHeader
		},
		{
			path: '/component/HelpButton/:example?',
			name: 'HelpButton',
			component: ComponentHelpButton
		},
		{
			path: '/component/Icon/:example?',
			name: 'Icon',
			component: ComponentIcon
		},
		{
			path: '/component/List/:example?',
			name: 'List',
			component: ComponentList
		},
		{
			path: '/component/ListPanel/:example?',
			name: 'ListPanel',
			component: ComponentListPanel
		},
		{
			path: '/component/ListPanel/components/AnnouncementsListPanel/:example?',
			name: 'AnnouncementsListPanel',
			component: ComponentAnnouncementsListPanel
		},
		{
			path: '/component/ListPanel/components/CatalogListPanel/:example?',
			name: 'CatalogListPanel',
			component: ComponentCatalogListPanel
		},
		{
			path: '/component/ListPanel/components/DoiListPanel/:example?',
			name: 'DoiListPanel',
			component: ComponentDoiListPanel
		},
		{
			path: '/component/ListPanel/components/DoiListPanelOJS/:example?',
			name: 'DoiListPanelOJS',
			component: ComponentDoiListPanelOJS
		},
		{
			path: '/component/ListPanel/components/EmailTemplatesListPanel/:example?',
			name: 'EmailTemplatesListPanel',
			component: ComponentEmailTemplatesListPanel
		},
		{
			path: '/component/ListPanel/components/SelectReviewerListPanel/:example?',
			name: 'SelectReviewerListPanel',
			component: ComponentSelectReviewerListPanel
		},
		{
			path:
				'/component/ListPanel/components/SubmissionFilesListPanel/:example?',
			name: 'SubmissionFilesListPanel',
			component: ComponentSubmissionFilesListPanel
		},
		{
			path: '/component/ListPanel/components/SubmissionsListPanel/:example?',
			name: 'SubmissionsListPanel',
			component: ComponentSubmissionsListPanel
		},
		{
			path: '/component/Modal/:example?',
			name: 'Modal',
			component: ComponentModal
		},
		{
			path: '/component/MultilingualProgress/:example?',
			name: 'MultilingualProgress',
			component: ComponentMultilingualProgress
		},
		{
			path: '/component/Notification/:example?',
			name: 'Notification',
			component: ComponentNotification
		},
		{
			path: '/component/Orderer/:example?',
			name: 'Orderer',
			component: ComponentOrderer
		},
		{
			path: '/component/Page/:example?',
			name: 'Page',
			component: ComponentPage
		},
		{
			path: '/component/Pagination/:example?',
			name: 'Pagination',
			component: ComponentPagination
		},
		{
			path: '/component/ProgressBar/:example?',
			name: 'ProgressBar',
			component: ComponentProgressBar
		},
		{
			path: '/component/Search/:example?',
			name: 'Search',
			component: ComponentSearch
		},
		{
			path: '/component/Spinner/:example?',
			name: 'Spinner',
			component: ComponentSpinner
		},
		{
			path: '/component/StatsPage/:example?',
			name: 'StatsPage',
			component: ComponentStatsPage
		},
		{
			path: '/component/Table/:example?',
			name: 'Table',
			component: ComponentTable
		},
		{
			path: '/component/Tabs/:example?',
			name: 'Tabs',
			component: ComponentTabs
		},
		{
			path: '/component/Tooltip/:example?',
			name: 'Tooltip',
			component: ComponentTooltip
		},
		{
			path: '/component/WorkflowPage/:example?',
			name: 'WorkflowPage',
			component: ComponentWorkflowPage
		},
		{
			path: '/utilities/Notify/:example?',
			name: 'Notify',
			component: ComponentNotify
		}
	]
});
