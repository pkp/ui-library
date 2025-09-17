<template>
	<CitationManagerMetadataLookup />
	<CitationManagerAddRawCitations />
	<CitationManagerStatusProcessed
		v-if="citationStore.citationsMetadataLookup"
	/>
	<div>
		<PkpButton
			class="cursor-pointer text-lg-normal"
			:is-link="true"
			@click="citationStore.citationDeleteAllCitations"
		>
			{{ t('submission.citations.structured.deleteAllLink') }}
		</PkpButton>
	</div>
	<PkpTable aria-label="Structured References" :aria-describedby="headingId">
		<template #label>
			<h3 class="text-4 font-semibold">
				{{ t('submission.citations.structured') }}
			</h3>
			<span class="text-lg-normal">
				{{ t('submission.citations.structured.descriptionTable') }}
			</span>
		</template>
		<template #top-controls>
			<div class="flex gap-x-2">
				<component
					:is="Components[action.component] || action.component"
					v-bind="action.props || {}"
					v-for="(action, i) in citationStore.topItems"
					:key="i"
				></component>
			</div>
		</template>
		<TableHeader>
			<TableColumn
				v-for="(column, i) in citationStore.columns"
				:key="i"
				:class="i > 0 ? '!w-16 !text-center' : ''"
			>
				<span v-if="column.isHeaderComponent">
					<component :is="Components[column.header] || column.header" />
				</span>
				<span v-else :class="column.headerSrOnly ? 'sr-only' : ''">
					{{ column.header }}
				</span>
			</TableColumn>
		</TableHeader>
		<TableBody
			:empty-text="t('submission.citations.structured.emptyCitations')"
		>
			<TableRow
				v-for="citation in citationStore.citationsFiltered"
				:key="citation.id"
			>
				<component
					:is="Components[column.component] || column.component"
					v-for="(column, index) in citationStore.columns"
					:key="index"
					v-bind="citation"
					:citation="citation"
				></component>
			</TableRow>
		</TableBody>
	</PkpTable>
</template>

<script setup>
import {useId} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import PkpButton from '@/frontend/components/PkpButton/PkpButton.vue';
import PkpTable from '@/components/Table/Table.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableRow from '@/components/Table/TableRow.vue';
import CitationManagerCellCitation from '@/managers/CitationManager/CitationManagerCellCitation.vue';
import CitationManagerCellToggle from '@/managers/CitationManager/CitationManagerCellToggle.vue';
import CitationManagerToggleAll from '@/managers/CitationManager/CitationManagerToggleAll.vue';
import CitationManagerCellActions from '@/managers/CitationManager/CitationManagerCellActions.vue';
import CitationManagerSearchField from '@/managers/CitationManager/CitationManagerSearchField.vue';
import CitationManagerStatusProcessed from '@/managers/CitationManager/CitationManagerStatusProcessed.vue';
import CitationManagerAddRawCitations from '@/managers/CitationManager/CitationManagerAddRawCitations.vue';
import CitationManagerMetadataLookup from '@/managers/CitationManager/CitationManagerMetadataLookup.vue';
import {useCitationManagerStore} from './citationManagerStore.js';

const {t} = useLocalize();

const headingId = useId();

const Components = {
	CitationManagerCellCitation,
	CitationManagerCellToggle,
	CitationManagerToggleAll,
	CitationManagerCellActions,
	CitationManagerSearchField,
};

const props = defineProps({
	submission: {type: Object, required: true},
	publication: {type: Object, required: true},
	canEdit: {type: Boolean, required: true},
	componentForms: {type: Object, required: true},
});

const citationStore = useCitationManagerStore(props);
</script>
