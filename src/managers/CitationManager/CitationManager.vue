<template>
	<!-- structured references -->
	<div>
		<div class="pkpFormField__heading pkpFormFieldLabel">
			{{ t('submission.citations.structured') }}
		</div>
		<div class="pkpFormField__description">
			{{ t('submission.citations.structured.description') }}
		</div>
		<div>
			<input
				class="pkpFormField--options__input"
				type="checkbox"
				id="citations-useStructuredCitations"
				@change="citationStore.updateUseStructuredCitations()"
				v-model="citationStore.useStructuredCitations"
			/>
			<label
				for="citations-useStructuredCitations"
				class="pkpFormField--options__optionLabel"
			>
				{{ t('submission.citations.structured.useStructuredCitations') }}
			</label>
		</div>
	</div>

	<!-- references -->
	<div>
		<div class="pkpFormField__heading pkpFormFieldLabel">
			{{ t('submission.citations') }}
		</div>
		<div class="pkpFormField__description">
			{{ t('submission.citations.description') }}
		</div>
		<div>
			<textarea
				class="pkpFormField__input pkpFormField--textarea__input !h-[9em]"
				v-model="citationsRawToBeAdded"
			/>
		</div>
		<div>
			<PkpButton
				class="my-2"
				:is-required="true"
				:disabled="!citationStore.citationsRawToBeAdded"
				@click="citationStore.handleAddCitationsRawToList"
			>
				{{ t('common.add', {}) }}
			</PkpButton>
		</div>
	</div>

	<!-- structured references list -->
	<PkpTable aria-label="Example for basic table" :aria-describedby="headingId">
		<template #label>
			<h3 class="">
				{{ t('submission.citations.structured') }}
			</h3>
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
			<TableColumn v-for="(column, i) in citationStore.columns" :key="i">
				<span :class="column.headerSrOnly ? 'sr-only' : ''">
					{{ column.header }}
				</span>
			</TableColumn>
		</TableHeader>
		<TableBody>
			<TableRow
				v-for="(citation, index) in citationStore.citations"
				:key="citation.id"
			>
				<component
					:is="Components[column.component] || column.component"
					v-for="(column, i) in citationStore.columns"
					:key="i"
					v-bind="column.props"
					:citation="citation"
					:use-structured-citations="citationStore.useStructuredCitations"
					:is-row-expanded="citationStore.isAllRowsExpanded"
				></component>
			</TableRow>
		</TableBody>
	</PkpTable>

	<div>
		<hr />
		publication <textarea style="border: 1px solid #ccc; height: 100px">{{ props.publication }}</textarea>
		citations <textarea style="border: 1px solid #ccc; height: 100px">{{ citationStore.citations }}</textarea>
		<p>&nbsp;</p>
		<p>&nbsp;</p>
		<p>&nbsp;</p>
	</div>
</template>

<script setup>
import {useId} from 'vue';

import PkpButton from '@/components/Button/Button.vue';
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

import {useCitationManagerStore} from './citationManagerStore.js';
import {useLocalize} from '@/composables/useLocalize';

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
});

const citationStore = useCitationManagerStore(props);
</script>
