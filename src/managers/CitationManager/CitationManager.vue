<template>
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
			v-model="citationStore.useStructuredCitations"
		/>
		<label
			for="citations-useStructuredCitations"
			class="pkpFormField--options__optionLabel"
		>
			{{ t('submission.citations.structured.useStructuredReferences') }}
		</label>
	</div>

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
		<Button
			:is-required="true"
			:disabled="!citationsRawToBeAdded"
			@click="handleAddCitationsRawToList"
		>
			{{ t('common.add', {}) }}
		</Button>
	</div>

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
				v-for="citation in citationStore.citations"
				:key="citation.id"
			>
				<component
					:is="Components[column.component] || column.component"
					v-for="(column, i) in citationStore.columns"
					:key="i"
					v-bind="column.props"
					:review-assignment="citation"
				></component>
			</TableRow>
		</TableBody>
	</PkpTable>

	<!-- <textarea>{{ props.publication }}</textarea> -->
	<textarea>{{ citationStore.citations }}</textarea>
	<!-- <textarea>{{ citationStore.citationsRaw }}</textarea> -->
</template>

<script setup>
import {useCitationManagerStore} from './citationManagerStore.js';
import TableHeader from '@/components/Table/TableHeader.vue';
import Button from '@/components/Button/Button.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableBody from '@/components/Table/TableBody.vue';
import PkpTable from '@/components/Table/Table.vue';
import TableRow from '@/components/Table/TableRow.vue';
import {useLocalize} from '@/composables/useLocalize';
import {ref, useId} from 'vue';
import {useDataChanged} from '@/composables/useDataChanged';
import _dummyComponent from '@/managers/CitationManager/_dummyComponent.vue';
import CitationManagerCellActions from '@/managers/CitationManager/CitationManagerCellActions.vue';
import CitationManagerActionButton from './CitationManagerActionButton.vue';

const props = defineProps({
	submission: {type: Object, required: true},
	publication: {type: Object, required: true},
	canEdit: {type: Boolean, required: true},
});

const citationStore = useCitationManagerStore(props);

const {t} = useLocalize();
const headingId = useId();
const {triggerDataChange} = useDataChanged();
const Components = {
	CitationManagerCellActions,
	CitationManagerActionButton,
	_dummyComponent
};

const citationsRawToBeAdded = ref('');

function handleAddCitationsRawToList() {
	citationsRawToBeAdded.value = '';
	console.log(citationsRawToBeAdded.value);
}
</script>
