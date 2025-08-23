<template>
	<TableCell :is-row-header="false">
		<div>
			<div>
				<a v-if="citation.doi" :href="citation.doi" target="_blank">
					{{ citation.doi.replace('https://doi.org/', '') }}
				</a>
				<a v-if="citation.url" :href="citation.url" target="_blank">
					{{ citation.url }}
				</a>
				<a v-if="citation.arxiv" :href="citation.arxiv" target="_blank">
					{{ citation.arxiv }}
				</a>
				<a v-if="citation.handle" :href="citation.handle" target="_blank">
					{{ citation.handle }}
				</a>
				<span v-if="citation.urn">urn: {{ citation.urn }}</span>
			</div>
			<div>{{ citation.title }}</div>
		</div>

		<div v-if="toggleStatusRow">
			<div>
				<span v-for="(author, authorIndex) in citation.authors">
					<span>{{ author.familyName }} {{ author.givenName }}</span>
					<a v-if="author.orcid" :href="author.orcid" target="_blank">
						<Icon
							icon="Orcid"
							:class="'relative top-[-2px] inline-block h-auto w-[16px] align-middle'"
							:inline="true"
						/>
					</a>
				</span>
			</div>
			<div v-if="citation.sourceName">
				{{ citation.sourceName }}
			</div>
			<div>
				<span v-if="citation.date">Date: {{ citation.date }}</span>
				<span v-if="citation.volume">Volume: {{ citation.volume }}</span>
				<span v-if="citation.issue">Issue number: {{ citation.issue }}</span>
				<span v-if="citation.firstPage && citation.lastPage">
					Pages: {{ citation.firstPage }} - {{ citation.lastPage }}
				</span>
				<span v-if="citation.pages">Total pages: {{ citation.pages }}</span>
			</div>
		</div>
		<div :class="citation.isStructured && toggleStatusRow ? 'w-fit p-1' : ''">
			{{ citation.rawCitation }}
		</div>
	</TableCell>
</template>

<script setup>
import {computed} from 'vue';
import TableCell from '@/components/Table/TableCell.vue';
import Icon from '@/components/Icon/Icon.vue';
import {useCitationManagerStore} from '@/managers/CitationManager/citationManagerStore';

const props = defineProps({
	citation: {type: Object, required: true},
});

const citation = computed(() => props.citation);

const citationStore = useCitationManagerStore();

const toggleStatusRow = computed(() => {
	return !!citationStore.toggleStatusRows[citation.value.id];
});
</script>
