<template>
	<FormGroupHeader
		:group-id="groupId"
		:label="t('common.details')"
		:description="t('discussion.form.detailsDescription')"
	/>

	<template v-if="!inDisplayMode">
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
			role="list"
			:aria-label="t('search.searchResults')"
		>
			<li v-for="template in templates" :key="template.id" role="listitem">
				<button
					class="mt-2 w-full border border-light p-4 text-start"
					:class="{
						'cursor-not-allowed bg-disabled': isDisabled(template),
						'border-light hover:border-hover': !isDisabled(template),
					}"
					:disabled="isDisabled(template)"
					type="button"
					@click="emit('selectTemplate', template)"
				>
					<div
						class="text-lg-medium"
						:class="isDisabled(template) ? 'text-disabled' : 'text-primary'"
					>
						<span class="uppercase">
							{{
								isTaskTemplate(template)
									? t('submission.query.task')
									: t('discussion.name')
							}}
						</span>
						- {{ template.title }}
					</div>
					<div class="mt-1 text-base-normal text-secondary">
						{{
							isTaskTemplate(template)
								? t('discussion.template.taskDescription')
								: t('discussion.template.discussionDescription')
						}}
					</div>
				</button>
			</li>
		</ul>
	</template>
</template>

<script setup>
import FormGroupHeader from '@/components/Form/FormGroupHeader.vue';
import Search from '@/components/Search/Search.vue';
import {t} from '@/utils/i18n';

const emit = defineEmits(['selectTemplate']);

const props = defineProps({
	templates: {
		type: Array,
		default: () => [],
	},
	/** The groupId to use from FormGroup component */
	groupId: {
		type: String,
		required: true,
	},
	inDisplayMode: {
		type: Boolean,
		required: true,
	},
	isTask: {
		type: Boolean,
		required: false,
	},
});

function isDisabled(template) {
	return (
		props.isTask && template.type === pkp.const.EDITORIAL_TASK_TYPE_DISCUSSION
	);
}

function isTaskTemplate(template) {
	return template.type === pkp.const.EDITORIAL_TASK_TYPE_TASK;
}
</script>
