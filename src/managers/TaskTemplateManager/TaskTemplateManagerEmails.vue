<template>
	<FormGroupHeader
		:group-id="groupId"
		:label="t('discussion.name')"
		:description="t('discussion.form.discussionDescription')"
	/>

	<div class="mt-4 text-lg-bold">
		{{ t('discussion.form.templatesLabel') }}
		<Spinner v-if="isLoadingEmailTemplates" />
	</div>
	<Search
		:search-label="t('common.findTemplate')"
		class="mt-2"
		:search-phrase="searchPhrase"
		@search-phrase-changed="
			(newSearchPhrase) => (searchPhrase = newSearchPhrase)
		"
	/>
	<ul
		class="mt-2 max-h-80 list-none overflow-y-auto p-0"
		role="list"
		:aria-label="t('search.searchResults')"
	>
		<li
			v-for="emailTemplate in emailTemplatesData?.emailTemplates"
			:key="emailTemplate.id"
			role="listitem"
		>
			<button
				class="mt-2 w-full border border-light p-4 text-start hover:border-hover"
				@click="emit('selectEmailTemplate', emailTemplate)"
			>
				<div class="text-lg-medium text-primary">
					{{ localize(emailTemplate.name) }}
				</div>
				<div class="mt-1 line-clamp-2 text-base-normal text-secondary">
					{{ localize(emailTemplate.body) }}
				</div>
			</button>
		</li>
	</ul>
</template>

<script setup>
import {t, localize} from '@/utils/i18n';
import {useTaskTemplateManagerEmails} from './useTaskTemplateManagerEmails';

import FormGroupHeader from '@/components/Form/FormGroupHeader.vue';
import Search from '@/components/Search/Search.vue';
import Spinner from '@/components/Spinner/Spinner.vue';

const emit = defineEmits(['selectEmailTemplate']);

const props = defineProps({
	/** The groupId to use from FormGroup component */
	groupId: {
		type: String,
		required: true,
	},
	taskTemplate: {
		type: Object,
		required: false,
		default: () => null,
	},
	stage: {
		type: Object,
		required: false,
		default: () => null,
	},
});

const {emailTemplatesData, isLoadingEmailTemplates} =
	useTaskTemplateManagerEmails(props);
</script>
