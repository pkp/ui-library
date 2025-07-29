<template>
	<FormGroupHeader
		:label="t('common.details')"
		:description="t('discussion.form.detailsDescription')"
	/>

	<div v-if="templates.length" class="mt-4 text-lg-bold">
		{{ t('discussion.form.templatesLabel') }}
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
		aria-live="true"
		role="list"
		:aria-label="t('search.searchResults')"
	>
		<li v-for="template in templates" :key="template.id">
			<button
				class="mt-2 w-full border border-light p-4 text-start hover:border-hover"
				@click="
					() => {
						emit('selectTemplate', template);
					}
				"
			>
				<div class="text-lg-medium text-primary">
					<span class="uppercase">
						{{
							template.type === 'Task'
								? t('submission.task')
								: t('submission.discussion')
						}}
					</span>
					- {{ template.name }}
				</div>
				<div class="mt-1 text-base-normal text-secondary">
					{{
						template.type === 'Task'
							? t('discussion.template.taskDescription')
							: t('discussion.template.discussionDescription')
					}}
				</div>
			</button>
		</li>
	</ul>
</template>

<script setup>
import FormGroupHeader from '@/components/Form/FormGroupHeader.vue';
import Search from '@/components/Search/Search.vue';
import {t} from '@/utils/i18n';

const emit = defineEmits(['selectTemplate']);

defineProps({
	templates: {
		type: Array,
		default: () => [],
	},
});
</script>
