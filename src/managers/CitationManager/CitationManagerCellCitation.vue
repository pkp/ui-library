<template>
	<TableCell :is-row-header="false">
		<!-- citationsMetadataLookup enabled -->
		<div v-if="citationStore.citationsMetadataLookup">
			<!-- all -->
			<div class="text-lg-normal">
				<a
					v-if="citation.doi"
					:is-link="true"
					:href="citationStore.doiUrlPrefix + citation.doi"
					target="_blank"
				>
					{{ citation.doi }}
				</a>
				<a
					v-if="citation.url"
					:is-link="true"
					:href="citation.url"
					target="_blank"
				>
					{{ citation.url }}
				</a>
				<a
					v-if="citation.arxiv"
					:is-link="true"
					:href="citationStore.arxivUrlPrefix + citation.arxiv"
					target="_blank"
				>
					{{ citation.arxiv }}
				</a>
				<a
					v-if="citation.handle"
					:is-link="true"
					:href="citationStore.handleUrlPrefix + citation.handle"
					target="_blank"
				>
					{{ citation.handle }}
				</a>
				<span v-if="citation.urn">urn: {{ citation.urn }}</span>
			</div>
			<!-- is structured -->
			<div v-if="citation.isStructured">
				<div class="pt-2 text-secondary">{{ citation.title }}</div>
				<div v-if="isExpanded">
					<div class="py-2">
						<ul class="text-base-normal">
							<li
								v-for="(author, authorIndex) in citation.authors"
								:key="authorIndex"
								class="inline-flex items-center"
							>
								<span class="me-2 inline-flex items-center">
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
											{{
												t('submission.citations.structured.label.authorOrcid', {
													givenName: author.givenName,
													familyName: author.familyName,
												})
											}}
										</span>
									</a>
								</span>
							</li>
						</ul>
					</div>
					<div v-if="citation.sourceName" class="text-sm-normal text-secondary">
						{{ citation.sourceName }}
					</div>
					<div class="py-2 text-sm-normal">
						<dl class="flex gap-x-1">
							<dt v-if="citation.date" class="inline text-secondary">
								{{
									t('semicolon', {
										label: t('submission.citations.structured.label.date'),
									})
								}}
							</dt>
							<dd v-if="citation.date" class="inline">
								{{ formatShortDate(citation.date) }}
							</dd>
							<dt v-if="citation.volume" class="ms-3 inline text-secondary">
								{{
									t('semicolon', {
										label: t('submission.citations.structured.label.volume'),
									})
								}}
							</dt>
							<dd v-if="citation.volume" class="inline">
								{{ citation.volume }}
							</dd>
							<dt v-if="citation.issue" class="ms-3 inline text-secondary">
								{{
									t('semicolon', {
										label: t(
											'submission.citations.structured.label.issueNumber',
										),
									})
								}}
							</dt>
							<dd v-if="citation.issue" class="inline">{{ citation.issue }}</dd>
							<dt
								v-if="citation.firstPage && citation.lastPage"
								class="ms-3 inline text-secondary"
							>
								{{
									t('semicolon', {
										label: t('submission.citations.structured.label.pages'),
									})
								}}
							</dt>
							<dd v-if="citation.firstPage && citation.lastPage" class="inline">
								{{ citation.firstPage }} - {{ citation.lastPage }}
							</dd>
						</dl>
					</div>
					<div v-if="citation.isStructured" class="w-fit pt-1 text-xs-normal">
						{{ citation.rawCitation }}
					</div>
				</div>
				<div class="mt-2">
					<a v-if="citation.wikidata" :href="citation.wikidata" target="_blank">
						<Badge :color-variant="'primary'" :size-variant="'compact'">
							{{ t('submission.citations.structured.label.wikidata') }}
						</Badge>
					</a>
					<a v-if="citation.openAlex" :href="citation.openAlex" target="_blank">
						<Badge :color-variant="'primary'" :size-variant="'compact'">
							{{ t('submission.citations.structured.label.openAlex') }}
						</Badge>
					</a>
				</div>
			</div>
			<!-- is not structured -->
			<div v-else>
				<div>{{ citation.rawCitation }}</div>
				<div
					v-if="citation.processingStatus == citationProcessingStatus.PROCESSED"
					class="mt-2"
				>
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
import TableCell from '@/components/Table/TableCell.vue';
import Icon from '@/components/Icon/Icon.vue';
import {useCitationManagerStore} from './citationManagerStore';
import {useDate} from '@/composables/useDate';

const {t} = useLocalize();

const {formatShortDate} = useDate();

const props = defineProps({
	citation: {type: Object, required: true},
});

const citation = computed(() => props.citation);

const citationStore = useCitationManagerStore();

const isExpanded = computed(() => {
	return citationStore.expandedIds.includes(citation.value.id);
});

const citationProcessingStatus = pkp.const.citationProcessingStatus;
</script>
