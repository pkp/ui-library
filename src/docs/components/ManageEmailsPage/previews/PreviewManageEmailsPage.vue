<template>
	<div class="app__page width width--wide">
		<list-panel
			class="manageEmails__listPanel"
			:items="currentMailables"
			:is-sidebar-visible="true"
		>
			<pkp-header slot="header">
				<h1>Emails</h1>
				<template slot="actions">
					<search
						search-label="Search by name or description"
						:search-phrase="searchPhrase"
						@search-phrase-changed="
							(newSearch) => (this.searchPhrase = newSearch)
						"
					></search>
					<pkp-button @click="confirmResetAll" :isWarnable="true">
						Reset All
					</pkp-button>
				</template>
			</pkp-header>
			<template v-slot:item-title="{item}">
				{{ item.name }}
			</template>
			<template v-slot:item-subtitle="{item}">
				{{ item.description }}
			</template>
			<template v-slot:item-actions="{item}">
				<pkp-button @click="openMailable(item)">
					<span aria-hidden="true">Edit</span>
					<span class="-screenReader">
						{{ __('common.editItem', {name: item.name}) }}
					</span>
				</pkp-button>
			</template>
			<template slot="sidebar">
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
			:closeLabel="__('common.close')"
			name="mailable"
			:title="currentMailable ? currentMailable.name : ''"
			@closed="mailableModalClosed"
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
					<pkp-header slot="header">
						<h3>Templates</h3>
						<template slot="actions">
							<pkp-button @click="openTemplate()">Add Template</pkp-button>
						</template>
					</pkp-header>
					<template v-slot:item-subtitle="{item}">
						{{ localize(item.name) }}
					</template>
					<template v-slot:item-actions="{item}">
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
			:closeLabel="__('common.close')"
			name="template"
			:title="currentTemplate ? 'Edit Template' : 'Add Template'"
			@closed="templateModalClosed"
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
</template>

<script>
import ManageEmailsPage from '../../../../components/Container/ManageEmailsPage.vue';
import templateForm from '../../../components/Form/helpers/form-email-template';

export default {
	extends: ManageEmailsPage,
	data() {
		return {
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
				'Are you sure you want to unassign the template <strong>{$template}</strong> from the <strong>{$mailable}</strong> email?',
			i18nResetAll: 'Reset All',
			i18nResetAllMessage:
				'If you reset all templates, all modifications to the email templates will be lost. Do you want to confirm this operation?',
			mailables: [],
			templateForm: {...templateForm},
		};
	},
	methods: {
		alert(msg) {
			alert(msg);
		},
		getMailable(mailable, onSuccess) {
			$.ajax({
				url: 'mailable.json',
				type: 'GET',
				context: this,
				error() {
					alert('failed to load mailable at /mailable.json');
				},
				success: onSuccess,
			});
		},
		getTemplate(template, onSuccess) {
			this.getMailable('', (mailable) => {
				onSuccess.apply(this, [mailable.emailTemplates[0]]);
			});
		},
	},
	created() {
		$.ajax({
			url: 'mailables.json',
			method: 'GET',
			context: this,
			success(r) {
				this.mailables = r;
			},
			error(r) {
				alert('failed to load mailables from /mailables.json');
			},
		});
	},
};
</script>

<style lang="less">
@import '../../../../styles/_import';

.component--ManageEmails .component__exampleWrapper {
	background: @bg;
}
</style>
