<template>
	<SideModalBody>
		<template #title>
			{{ modalTitleLabel }}
		</template>
		<template #default="{closeModal}">
			<SideModalLayoutBasic>
				<PkpTable>
					<TableHeader>
						<TableColumn
							v-for="(column, i) in vocabularymodalStore.columns"
							:key="i"
						>
							<span :class="column.headerSrOnly ? 'sr-only' : ''">
								{{ column.header }}
							</span>
						</TableColumn>
						<!-- Expand/Collapse column -->
						<TableColumn>
							<span class="sr-only">
								{{ t('common.expand') }}
							</span>
						</TableColumn>
					</TableHeader>
					<TableBody>
						<VocabularyTableRows
							:items="vocabularymodalStore.items"
							:depth="0"
						/>
					</TableBody>
				</PkpTable>
				<PkpButton
					class="mt-2"
					@click="vocabularymodalStore.saveChanges(closeModal)"
				>
					{{ t('common.save') }}
				</PkpButton>
			</SideModalLayoutBasic>
		</template>
	</SideModalBody>
</template>

<script setup>
import PkpButton from '@/components/Button/Button.vue';
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import PkpTable from '@/components/Table/Table.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableBody from '@/components/Table/TableBody.vue';
import VocabularyTableRows from './VocabularyTableRows.vue';
import {useLocalize} from '@/composables/useLocalize';
import {useVocabularyModalStore} from './vocabularyModalStore';
const {t} = useLocalize();

const props = defineProps({
	modalTitleLabel: {type: String, required: true},
	initiallySelectedItems: {type: Array, default: () => []},
	items: {type: Array, default: () => []},
});

const emit = defineEmits(['saveChanges']);

const vocabularymodalStore = useVocabularyModalStore({props, emit});
</script>
