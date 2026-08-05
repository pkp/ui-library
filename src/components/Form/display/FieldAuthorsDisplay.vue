<template>
	<div>
		<component :is="headingElement" class="mb-1 inline-block text-xl-bold">
			{{ field.label }}
		</component>
		<div class="text-lg-normal">
			<template v-for="(author, index) in authors" :key="index">
				<span v-if="index > 0">{{ t('common.commaListSeparator') }}</span>
				<span class="inline-flex items-center">
					<span v-if="author.name">{{ author.name }}</span>
					<a
						v-if="author.orcid"
						class="inline-flex items-center"
						:href="author.orcid"
						target="_blank"
					>
						<Icon icon="Orcid" class="ms-1 w-4" aria-hidden="true" />
						<span class="sr-only">
							{{
								t('submission.citations.structured.label.authorOrcid', {
									givenName: author.givenName,
									familyName: author.familyName,
								})
							}}
						</span>
					</a>
				</span>
			</template>
		</div>
	</div>
</template>

<script setup>
import {computed} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import Icon from '@/components/Icon/Icon.vue';

const props = defineProps({
	field: {type: Object, required: true},
	headingElement: {required: true, type: String},
});

const {t} = useLocalize();

const authors = computed(() =>
	(props.field.value || [])
		.map((author) => ({
			...author,
			name: [author.givenName, author.familyName].filter(Boolean).join(' '),
		}))
		.filter((author) => author.name || author.orcid),
);
</script>
