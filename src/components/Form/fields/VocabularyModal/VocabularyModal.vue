<template>
	<SideModalBody>
		<template #title>
			{{ title }}
		</template>
		<template #default="{closeModal}">
			<SideModalLayoutBasic>
				<PkpTable>
					<TableHeader>
						<TableColumn></TableColumn>
						<TableColumn></TableColumn>
					</TableHeader>
					<TableBody>
						<VocabularyTableRows
							:items="items"
							:depth="0"
							:expanded-ids="expandedIds"
							:selected-item-ids="selectedItemIds"
							@toggle-item-expansion="toggleItemExpansion"
							@toggle-item-selection="toggleItemSelection"
						/>
					</TableBody>
				</PkpTable>
				<PkpButton class="mt-2" @click="saveChanges(closeModal)">
					{{ t('common.save') }}
				</PkpButton>
			</SideModalLayoutBasic>
		</template>
	</SideModalBody>
</template>

<script setup>
import {ref, computed} from 'vue';
import PkpButton from '@/components/Button/Button.vue';
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import PkpTable from '@/components/Table/Table.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableBody from '@/components/Table/TableBody.vue';
import VocabularyTableRows from './VocabularyTableRows.vue';
import {useLocalize} from '@/composables/useLocalize';

const props = defineProps({
	title: {type: String, required: true},
	initiallySelectedItems: {type: Array, default: () => []},
	items: {type: Array, default: () => []},
});

const emit = defineEmits(['saveChanges']);

const {t} = useLocalize();

const expandedIds = ref([]);

function toggleItemExpansion(identifier) {
	if (!expandedIds.value.includes(identifier)) {
		expandedIds.value.push(identifier);
	} else {
		expandedIds.value = expandedIds.value.filter((id) => id !== identifier);
	}
}

props.items.forEach((item) => {
	toggleItemExpansion(item.identifier);
});

// [{label, value}]
const selectedItems = ref([...props.initiallySelectedItems]);
const selectedItemIds = computed(() =>
	selectedItems.value.map((item) => item.value.identifier),
);
function toggleItemSelection(item) {
	console.log('toggleItemSelection');
	if (
		selectedItems.value.find(
			(_item) => _item.value.identifier === item.identifier,
		)
	) {
		selectedItems.value = selectedItems.value.filter(
			(_item) => _item.value.identifier !== item.identifier,
		);
	} else {
		selectedItems.value.push({value: item, label: item.name});
	}
}

function saveChanges(closeModalFn) {
	emit('saveChanges', selectedItems.value);
	closeModalFn();
}
</script>
