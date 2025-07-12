<template>
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
		class="mt-1 list-none p-0"
		aria-live="true"
		:aria-label="t('search.searchResults')"
	>
		<li v-for="template in templates" :key="template.id">
			<button
				class="mt-2 w-full border border-light p-4 text-start hover:border-hover"
				@click="
					() => {
						emit('on-event', template);
					}
				"
			>
				<div class="text-lg-medium text-primary">
					{{ template.name }}
				</div>
				<div class="mt-1 text-base-normal text-secondary">
					{{ template.description }}
				</div>
			</button>
		</li>
	</ul>
</template>

<script setup>
import {t} from '@/utils/i18n';
import Search from '@/components/Search/Search.vue';

const emit = defineEmits(['on-event']);

defineProps({
	templates: {
		type: Array,
		default: () => [],
	},
});
</script>
