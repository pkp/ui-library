import {http, HttpResponse} from 'msw';
import MailableMock from '@/mocks/mailable.json';
import MailablesMock from '@/mocks/mailables.json';

import ManageEmailsPage from './ManageEmailsPage.vue';

import TemplateFormMock from '@/components/Form/mocks/form-email-template';

export default {
	title: 'Pages/ManageEmailsPage',
	component: ManageEmailsPage,
};

const ManageEmailsPageWithDataAndTemplate = {
	extends: ManageEmailsPage,
	template: `<div class="app__page width width--wide">
		<ListPanel
			class="manageEmails__listPanel"
			:items="currentMailables"
			:is-sidebar-visible="true"
		>
			<template #header>
				<PkpHeader>
					<h1>Emails</h1>
					<template #actions>
						<Search
							search-label="Search by name or description"
							:search-phrase="searchPhrase"
							@search-phrase-changed="(newSearch) => (searchPhrase = newSearch)"
						></Search>
						<PkpButton :is-warnable="true" @click="confirmResetAll">
							Reset All
						</PkpButton>
					</template>
				</PkpHeader>
			</template>
			<template #item-title="{item}">
				{{ item.name }}
			</template>
			<template #item-subtitle="{item}">
				{{ item.description }}
			</template>
			<template #item-actions="{item}">
				<PkpButton @click="openMailable(item)">
					<span aria-hidden="true">Edit</span>
					<span class="-screenReader">
						{{ t('common.editItem', {name: item.name}) }}
					</span>
				</PkpButton>
			</template>
			<template #sidebar>
				<PkpHeader>
					<h2>
						<Icon icon="Filter" class="h-4 w-4" :inline="true" />
						Filters
					</h2>
				</PkpHeader>
				<PkpFilter
					v-for="(name, value) in groupFilters"
					:key="value"
					param="groupIds"
					:title="name"
					:value="value"
					:is-filter-active="isFilterActive('groupIds', value)"
					@add-filter="addFilter"
					@remove-filter="removeFilter"
				></PkpFilter>
				<div class="listPanel__block">
					<PkpHeader>
						<h3>Sent From</h3>
					</PkpHeader>
					<PkpFilter
						v-for="(name, value) in fromFilters"
						:key="value"
						param="fromRoleIds"
						:title="name"
						:value="parseInt(value)"
						:is-filter-active="isFilterActive('fromRoleIds', parseInt(value))"
						@add-filter="addFilter"
						@remove-filter="removeFilter"
					></PkpFilter>
				</div>
				<div class="listPanel__block">
					<PkpHeader>
						<h3>Sent To</h3>
					</PkpHeader>
					<PkpFilter
						v-for="(name, value) in toFilters"
						:key="value"
						param="toRoleIds"
						:title="name"
						:value="parseInt(value)"
						:is-filter-active="isFilterActive('toRoleIds', parseInt(value))"
						@add-filter="addFilter"
						@remove-filter="removeFilter"
					></PkpFilter>
				</div>
			</template>
		</ListPanel>
	</div>
`,
	data() {
		return {
			mailablesApiUrl: 'https://mock/index.php/publicknowledge/api/v1/mailable',
			groupFilters: {
				submission: 'Submission',
				review: 'Review',
				copyediting: 'Copyediting',
				production: 'Production',
				other: 'Other',
			},
			fromFilters: {
				17: 'Editor', // ROLE_ID_SUB_EDITOR
				4096: 'Reviewer', // ROLE_ID_REVIEWER
				4097: 'Assistant', // ROLE_ID_ASSISTANT
				1048576: 'Reader', // ROLE_ID_READER
			},
			toFilters: {
				17: 'Editor', // ROLE_ID_SUB_EDITOR
				4096: 'Reviewer', // ROLE_ID_REVIEWER
				4097: 'Assistant', // ROLE_ID_ASSISTANT
				65536: 'Author', // ROLE_ID_AUTHOR
				1048576: 'Reader', // ROLE_ID_READER
				2097152: 'Subscription Manager', // ROLE_ID_SUBSCRIPTION_MANAGER
			},
			i18nRemoveTemplate: 'Remove Template',
			i18nRemoveTemplateMessage:
				'Are you sure you want to delete the template <strong>{$template}</strong>?',
			i18nResetAll: 'Reset All',
			i18nResetAllMessage:
				'If you reset all templates, all modifications to the email templates will be lost. Do you want to confirm this operation?',
			mailables: MailablesMock,
			templateForm: {...TemplateFormMock},
		};
	},
};

export const Default = {
	render: (args) => ({
		components: {
			ManageEmailsPageWithDataAndTemplate,
		},
		setup() {
			return {...args};
		},
		template: `
			<ManageEmailsPageWithDataAndTemplate />
		`,
	}),

	args: {},
	parameters: {
		msw: {
			handlers: [
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/mailable/*',
					async (r) => {
						return HttpResponse.json(MailableMock);
					},
				),
			],
		},
	},
};
