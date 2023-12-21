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
		<list-panel
			class="manageEmails__listPanel"
			:items="currentMailables"
			:is-sidebar-visible="true"
		>
			<template #header>
				<pkp-header>
					<h1>Emails</h1>
					<template #actions>
						<search
							search-label="Search by name or description"
							:search-phrase="searchPhrase"
							@search-phrase-changed="(newSearch) => (searchPhrase = newSearch)"
						></search>
						<pkp-button :is-warnable="true" @click="confirmResetAll">
							Reset All
						</pkp-button>
					</template>
				</pkp-header>
			</template>
			<template #item-title="{item}">
				{{ item.name }}
			</template>
			<template #item-subtitle="{item}">
				{{ item.description }}
			</template>
			<template #item-actions="{item}">
				<pkp-button @click="openMailable(item)">
					<span aria-hidden="true">Edit</span>
					<span class="-screenReader">
						{{ t('common.editItem', {name: item.name}) }}
					</span>
				</pkp-button>
			</template>
			<template #sidebar>
				<pkp-header>
					<h2>
						<icon icon="filter" :inline="true" />
						Filters
					</h2>
				</pkp-header>
				<pkp-filter
					v-for="(name, value) in groupFilters"
					:key="value"
					param="groupIds"
					:title="name"
					:value="value"
					:is-filter-active="isFilterActive('groupIds', value)"
					@add-filter="addFilter"
					@remove-filter="removeFilter"
				></pkp-filter>
				<div class="listPanel__block">
					<pkp-header>
						<h3>Sent From</h3>
					</pkp-header>
					<pkp-filter
						v-for="(name, value) in fromFilters"
						:key="value"
						param="fromRoleIds"
						:title="name"
						:value="parseInt(value)"
						:is-filter-active="isFilterActive('fromRoleIds', parseInt(value))"
						@add-filter="addFilter"
						@remove-filter="removeFilter"
					></pkp-filter>
				</div>
				<div class="listPanel__block">
					<pkp-header>
						<h3>Sent To</h3>
					</pkp-header>
					<pkp-filter
						v-for="(name, value) in toFilters"
						:key="value"
						param="toRoleIds"
						:title="name"
						:value="parseInt(value)"
						:is-filter-active="isFilterActive('toRoleIds', parseInt(value))"
						@add-filter="addFilter"
						@remove-filter="removeFilter"
					></pkp-filter>
				</div>
			</template>
		</list-panel>
		<modal
			:close-label="t('common.close')"
			name="mailable"
			:open="isModalOpenedMailable"
			:title="currentMailable ? currentMailable.name : ''"
			@close="closeMailableModal"
		>
			<template v-if="currentMailable">
				<p>{{ currentMailable.description }}</p>
				<p>
					Add and edit templates that you would like to make available to the
					user when they are sending this email. The default will be loaded
					automatically, and the user will be able to quickly load any other
					templates you add here.
				</p>
				<list-panel :items="currentMailable.emailTemplates">
					<template #header>
						<pkp-header>
							<h3>Templates</h3>
							<template #actions>
								<pkp-button @click="openTemplate()">Add Template</pkp-button>
							</template>
						</pkp-header>
					</template>
					<template #item-subtitle="{item}">
						{{ localize(item.name) }}
					</template>
					<template #item-actions="{item}">
						<badge v-if="item.key === currentMailable.emailTemplateKey">
							Default
						</badge>
						<pkp-button @click="openTemplate(item)">Edit</pkp-button>
						<pkp-button
							v-if="item.key === currentMailable.emailTemplateKey && item.id"
							:is-warnable="true"
							@click="confirmResetTemplate(item)"
						>
							Reset
						</pkp-button>
						<pkp-button
							v-else-if="item.id"
							:is-warnable="true"
							@click="confirmRemoveTemplate(item)"
						>
							Remove
						</pkp-button>
					</template>
				</list-panel>
			</template>
		</modal>
		<modal
			:close-label="t('common.close')"
			name="template"
			:open="isModalOpenedTemplate"
			:title="currentTemplate ? 'Edit Template' : 'Add Template'"
			@close="closeTemplateModal"
		>
			<pkp-form
				ref="templateForm"
				class="manageEmails__templateForm"
				v-bind="currentTemplateForm"
				@set="updateCurrentTemplateForm"
				@success="templateSaved"
			></pkp-form>
		</modal>
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
