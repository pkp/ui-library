<template>
	<TableCell :is-row-header="false">
		<!-- citationsMetadataLookup enabled -->
		<div v-if="citationStore.citationsMetadataLookup">
			<!-- all -->
			<div class="text-lg-normal">
				<PkpButton
					v-if="citation.doi"
					:is-link="true"
					:href="citationStore.doiPrefix + '/' + citation.doi"
					target="_blank"
				>
					{{ citation.doi }}
				</PkpButton>
				<PkpButton
					v-if="citation.url"
					:is-link="true"
					:href="citation.url"
					target="_blank"
				>
					{{ citation.url }}
				</PkpButton>
				<PkpButton
					v-if="citation.arxiv"
					:is-link="true"
					:href="citation.arxiv"
					target="_blank"
				>
					{{ citation.arxiv }}
				</PkpButton>
				<PkpButton
					v-if="citation.handle"
					:is-link="true"
					:href="citation.handle"
					target="_blank"
				>
					{{ citation.handle }}
				</PkpButton>
				<span v-if="citation.urn">urn: {{ citation.urn }}</span>
			</div>
			<!-- is structured -->
			<div v-if="citation.isStructured">
				<div>{{ citation.title }}</div>
				<div v-if="isExpanded">
					<div class="text-lg-normal leading-8">
						<ul>
							<li
								v-for="(author, authorIndex) in citation.authors"
								:key="authorIndex"
								class="inline"
							>
								<span>{{ author.familyName }} {{ author.givenName }}</span>
								<a
									v-if="author.orcid"
									class="inline-flex items-center"
									:href="author.orcid"
									target="_blank"
								>
									<!-- Icon component, marked as decorative -->
									<Icon icon="Orcid" class="mx-1 w-4" aria-hidden="true" />
									<!-- Screen reader-only text with author context -->
									<span class="sr-only">
										ORCID profile for {{ author.givenName }}
										{{ author.familyName }}
									</span>
								</a>
							</li>
						</ul>
					</div>
					<div v-if="citation.sourceName">
						{{ citation.sourceName }}
					</div>
					<div class="leading-8">
						<dl>
							// todo: The strings like Date/Volume etc needs to be localised
							<dt v-if="citation.date" class="inline">Date:</dt>
							<dd v-if="citation.date" class="inline">{{ citation.date }}</dd>
							<dt v-if="citation.volume" class="inline">Volume:</dt>
							<dd v-if="citation.volume" class="inline">
								{{ citation.volume }}
							</dd>
							<dt v-if="citation.issue" class="inline">Issue number:</dt>
							<dd v-if="citation.issue" class="inline">{{ citation.issue }}</dd>
							<dt v-if="citation.firstPage && citation.lastPage" class="inline">
								Pages:
							</dt>
							<dd v-if="citation.firstPage && citation.lastPage" class="inline">
								{{ citation.firstPage }} -
								{{ citation.lastPage }}
							</dd>
						</dl>
					</div>
					<div v-if="citation.isStructured" class="w-fit pt-1">
						{{ citation.rawCitation }}
					</div>
				</div>
				<div class="mt-2">
					<a v-if="citation.wikidata" :href="citation.wikidata" target="_blank">
						<Badge :color-variant="'primary'" :size-variant="'compact'">
							Wikidata
						</Badge>
					</a>
					<a v-if="citation.openAlex" :href="citation.openAlex" target="_blank">
						<Badge :color-variant="'primary'" :size-variant="'compact'">
							OpenAlex
						</Badge>
					</a>
				</div>
			</div>
			<!-- is not structured -->
			<div v-else>
				<div>{{ citation.rawCitation }}</div>
				<div v-if="citation.isProcessed" class="mt-2">
					<Badge :color-variant="'attention'" :size-variant="'compact'">
						{{
							t('submission.citations.structured.noStructuredInformationFound')
						}}
					</Badge>
				</div>
			</div>
		</div>
		<!-- citationsMetadataLookup disabled -->
		<div v-else>
			<div>{{ citation.rawCitation }}</div>
		</div>
	</TableCell>
</template>

<script setup>
import {computed} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import Badge from '@/components/Badge/Badge.vue';
import PkpButton from '@/components/Button/Button.vue';
import TableCell from '@/components/Table/TableCell.vue';
import Icon from '@/components/Icon/Icon.vue';
import {useCitationManagerStore} from '@/managers/CitationManager/citationManagerStore';

const {t} = useLocalize();

const props = defineProps({
	citation: {type: Object, required: true},
});

const citation = computed(() => props.citation);

const citationStore = useCitationManagerStore();

const isExpanded = computed(() => {
	return citationStore.expandedIds.includes(citation.value.id);
});
</script>
