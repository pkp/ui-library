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

		function getIdForItem(item) {
			return item?.value?.identifier || item.value;
		}

		function toggleItemExpansion(item) {
			const itemId = getIdForItem(item);
			if (!expandedIds.value.includes(itemId)) {
				expandedIds.value.push(itemId);
			} else {
				expandedIds.value = expandedIds.value.filter((id) => id !== itemId);
			}
		}

		items.value.forEach((item) => {
			toggleItemExpansion(item);
		});

		console.log('initiallySelectedItems:', props.initiallySelectedItems);
		const selectedItems = ref([...props.initiallySelectedItems]);
		const selectedItemIds = computed(() =>
			selectedItems.value.map((item) => getIdForItem(item)),
		);

		function toggleItemSelection(item) {
			if (
				selectedItems.value.find(
					(_item) => getIdForItem(_item) === getIdForItem(item),
				)
			) {
				selectedItems.value = selectedItems.value.filter(
					(_item) => getIdForItem(_item) !== getIdForItem(item),
				);
			} else {
				selectedItems.value.push(item);
			}
		}

		function isExpanded(item) {
			return expandedIds.value.includes(getIdForItem(item));
		}

		function isSelected(item) {
			return selectedItemIds.value.includes(getIdForItem(item));
		}

		function saveChanges(closeModalFn) {
			console.log('saveChanges:', selectedItems.value);
			emit('saveChanges', selectedItems.value);
			closeModalFn();
		}

		return {
			items,
			columns,
			isExpanded,
			isSelected,
			getIdForItem,
			toggleItemExpansion,
			toggleItemSelection,
			saveChanges,
			extender,
			props,
		};
	},
);
