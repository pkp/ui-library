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

		/** Items that have items children gets initially expanded */
		getExpandedableItems(items.value).forEach((item) => {
			toggleItemExpansion(item);
		});

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

		function getExpandedableItems(items) {
			const result = [];

			items.forEach((item) => {
				// If this node is expanded, collect its identifier
				if (item.items?.length) {
					result.push(item);
				}
				// If it has children, recurse into them
				if (Array.isArray(item.items) && item.items.length) {
					result.push(...getExpandedableItems(item.items));
				}
			});

			return result;
		}

		function isExpanded(item) {
			return expandedIds.value.includes(getIdForItem(item));
		}

		function isSelected(item) {
			return selectedItemIds.value.includes(getIdForItem(item));
		}

		function saveChanges(closeModalFn) {
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
