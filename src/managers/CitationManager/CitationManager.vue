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
				@change="updateUseStructuredCitations()"
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
				:disabled="!citationsRawToBeAdded"
				@click="handleAddCitationsRawToList"
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

	<hr />
	publication
	<textarea style="border: 1px solid #ccc; height: 100px">{{ props.publication }}</textarea>
	citations
	<textarea style="border: 1px solid #ccc; height: 100px">{{ citationStore.citations }}</textarea>

	<p>&nbsp;</p>
	<p>&nbsp;</p>
	<p>&nbsp;</p>
</template>

<script setup>
import {isReactive, onMounted, ref, useId, watch} from 'vue';

import PkpButton from '@/components/Button/Button.vue';
import PkpTable from '@/components/Table/Table.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableRow from '@/components/Table/TableRow.vue';

import CitationManagerCellCitation from '@/managers/CitationManager/CitationManagerCellCitation.vue';
import CitationManagerCellToggle from '@/managers/CitationManager/CitationManagerCellToggle.vue';
import CitationManagerToggleAll from '@/managers/CitationManager/CitationManagerToggleAll.vue';
import CitationManagerCellPrimaryActions from '@/managers/CitationManager/CitationManagerCellPrimaryActions.vue';
import CitationManagerSearchField from '@/managers/CitationManager/CitationManagerSearchField.vue';

import {useCitationManagerStore} from './citationManagerStore.js';
import {useLocalize} from '@/composables/useLocalize';
import {useModal} from '@/composables/useModal';

const {t} = useLocalize();
const headingId = useId();

const Components = {
	CitationManagerCellCitation,
	CitationManagerCellToggle,
	CitationManagerToggleAll,
	CitationManagerCellPrimaryActions,
	CitationManagerSearchField,
};

const props = defineProps({
	submission: {type: Object, required: true},
	publication: {type: Object, required: true},
	canEdit: {type: Boolean, required: true},
});

const citationStore = useCitationManagerStore(props);

const citationsRawToBeAdded = ref('');

function updateUseStructuredCitations() {
	if (!citationStore.useStructuredCitations) {
		const {openDialog} = useModal();
		openDialog({
			name: 'disableUseStructuredCitations',
			title: t('submission.citations.structured.disableModal.title', {}),
			message: t('submission.citations.structured.disableModal.message', {}),
			actions: [
				{
					label: t('common.yes', {}),
					isWarnable: true,
					callback: async (close) => {
						close();
					},
				},
				{
					label: t('common.no', {}),
					isPrimary: true,
					callback: (close) => {
						citationStore.useStructuredCitations = true;
						close();
					},
				},
			],
			close: () => {},
		});
	}
}

function handleAddCitationsRawToList() {
	// split rows by EOL
	// add to citationStore.citations
	// save new lines to database
	citationsRawToBeAdded.value = '';
	console.log(citationsRawToBeAdded.value);
}
</script>
