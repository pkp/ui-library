import {defineComponentStore} from '@/utils/defineComponentStore';
import {ref, computed, toRefs} from 'vue';
import {useVocabularyModalConfig} from './useVocabularyModalConfig';
import {useExtender} from '@/composables/useExtender';

export const useVocabularyModalStore = defineComponentStore(
	'vocabularyModalStore',
	({props, emit}) => {
		const {items} = toRefs(props);
		const extender = useExtender();
		const vocabularyModalConfig = extender.addFns(useVocabularyModalConfig());
		const expandedIds = ref([]);

		// Computed
		const columns = computed(() => vocabularyModalConfig.getColumns());

		function toggleItemExpansion(identifier) {
			if (!expandedIds.value.includes(identifier)) {
				expandedIds.value.push(identifier);
			} else {
				expandedIds.value = expandedIds.value.filter((id) => id !== identifier);
			}
		}

		items.value.forEach((item) => {
			toggleItemExpansion(item.identifier);
		});

		const selectedItems = ref([...props.initiallySelectedItems]);
		const selectedItemIds = computed(() =>
			selectedItems.value.map((item) => item.value.identifier),
		);
		function toggleItemSelection(item) {
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

		return {
			items,
			columns,
			selectedItemIds,
			expandedIds,
			toggleItemExpansion,
			toggleItemSelection,
			saveChanges,
			extender,
			props,
		};
	},
);
