<template>
	<SideModalBody class="text-base-normal">
		<template #title>
			{{ t('reviewer.step1.viewAllDetails') }}
		</template>
		<SideModalLayoutBasic>
			<div class="flex flex-col gap-8">
				<div>
					<h2
						v-strip-unsafe-html="title"
						class="text-2xl-bold text-default"
					></h2>

					<p v-if="authors" class="mt-1 text-lg-normal">
						{{ authors }}
					</p>
				</div>

				<div v-if="abstract">
					<h2 class="mb-1 text-xl-bold text-default">
						{{ t('common.abstract') }}
					</h2>
					<div v-strip-unsafe-html="abstract" class="text-lg-normal"></div>
				</div>

				<PkpTable v-if="dataCitations.length">
					<template #label>
						<h2>{{ t('submission.dataCitations') }}</h2>
					</template>
					<TableHeader>
						<TableColumn>
							{{ t('submission.dataCitations.label.datasetTitle') }}
						</TableColumn>
						<TableColumn>
							{{ t('submission.dataCitations.label.identifierType') }}
						</TableColumn>
						<TableColumn>
							{{ t('submission.dataCitations.label.url') }}
						</TableColumn>
					</TableHeader>
					<TableBody>
						<TableRow
							v-for="dataCitation in dataCitations"
							:key="dataCitation.id"
						>
							<TableCell :is-row-header="true">
								{{ dataCitation.title }}
							</TableCell>
							<TableCell>{{ dataCitation.identifierType }}</TableCell>
							<TableCell>
								<a
									v-if="dataCitation.url"
									:href="dataCitation.url"
									target="_blank"
									rel="noopener noreferrer"
								>
									{{ dataCitation.url }}
								</a>
							</TableCell>
						</TableRow>
					</TableBody>
				</PkpTable>

				<FormDisplayItemBasic
					v-if="dataAvailability"
					class="text-default"
					heading-element="h2"
					:heading="t('submission.dataAvailability')"
					:html-value="dataAvailability"
				></FormDisplayItemBasic>

				<FormDisplayItemBasic
					v-if="fundingStatement"
					class="text-default"
					heading-element="h2"
					:heading="t('submission.fundingStatement')"
					:html-value="fundingStatement"
				></FormDisplayItemBasic>

				<PkpTable
					v-if="metadataRows.length"
					:aria-label="t('submission.informationCenter.metadata')"
				>
					<TableHeader>
						<TableColumn>
							{{ t('submission.informationCenter.metadata') }}
						</TableColumn>
						<TableColumn>{{ t('common.details') }}</TableColumn>
					</TableHeader>
					<TableBody>
						<TableRow v-for="row in metadataRows" :key="row.label">
							<TableCell :is-row-header="true">{{ row.label }}</TableCell>
							<TableCell>{{ row.value }}</TableCell>
						</TableRow>
					</TableBody>
				</PkpTable>
			</div>
		</SideModalLayoutBasic>
	</SideModalBody>
</template>

<script setup>
import {computed} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import PkpTable from '@/components/Table/Table.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableRow from '@/components/Table/TableRow.vue';
import TableCell from '@/components/Table/TableCell.vue';
import FormDisplayItemBasic from '@/components/Form/display/FormDisplayItemBasic.vue';

const props = defineProps({
	/** Submission details available for all review types */
	title: {type: String, default: ''},
	abstract: {type: String, default: ''},
	keywords: {type: Array, default: () => []},
	subjects: {type: Array, default: () => []},
	disciplines: {type: Array, default: () => []},

	/** Not visible to double-anonymous reviewers */
	authors: {type: String, default: null},
	dataAvailability: {type: String, default: null},
	fundingStatement: {type: String, default: null},
	dataCitations: {type: Array, default: () => []},

	/** Legacy options automatically added by modalStore when opened from a legacy modal handler */
	legacyOptions: {type: Object, default: () => ({})},
});

const {t} = useLocalize();

const metadataRows = computed(() => {
	const rows = [
		{label: t('common.keywords'), value: props.keywords.join(', ')},
		{label: t('common.subjects'), value: props.subjects.join(', ')},
		{label: t('common.discipline'), value: props.disciplines.join(', ')},
	];

	return rows.filter((row) => row.value);
});
</script>
