import {ref, toRef} from 'vue';
import debounce from 'debounce';

export function useAutosuggest(state, props = {}, emit, setSuggestions) {
	const {
		id,
		inputProps,
		selectedLabel,
		isDisabled,
		deselectLabel,
		isMultiple,
		localeKey,
		apiUrl,
	} = props;

	const suggestions = ref(state.suggestions || []);
	const currentValue = props.currentValue;
	const currentSelected = ref(state.currentSelected || []);
	const name = ref(props.name || '');
	const inputValue = toRef(state, 'inputValue');

	/**
	 * Respond to selected events from vue-autosuggest
	 *
	 * This wrapper passes the selected item to the select method.
	 *
	 * @param {Object|null} suggestion
	 */
	function selectSuggestion(suggestion) {
		select(suggestion ? suggestion : null);
	}

	/**
	 * Remove an item from the selected list
	 *
	 * @param {Object} itemToRemove
	 */
	function deselect(itemToRemove) {
		let newSelected = [...currentSelected.value];
		newSelected.splice(
			newSelected.findIndex((item) => item.value === itemToRemove.value),
			1,
		);
		setSelected(newSelected);
	}

	/**
	 * Add a suggested item to the list of selected items
	 *
	 * This method may be called without a null item argument
	 * when the user types into the field and hits enter. In
	 * such cases, select the first autosuggestion result if
	 * one exists
	 *
	 * @param {Object|null} item The item that was selected
	 */
	function select(item) {
		if (!item) {
			if (!inputValue.value || !suggestions.value.length) {
				return;
			}
			item = suggestions.value[0];
		}

		setSelected([...currentSelected.value, item]);
		inputValue.value = '';
	}

	/**
	 * Emit events to change the selected items and the field's value
	 */
	function setSelected(selected) {
		if (selected?.length > 1 && !isMultiple) {
			// override selected value if only one option can be selected
			selected = [selected[1]];
		}

		emit('change', name.value, 'selected', selected, localeKey);
		emit(
			'change',
			name.value,
			'value',
			selected.map((s) => s.value),
			localeKey,
		);
	}

	function getSuggestions(params, cb = () => {}) {
		debounce(function () {
			if (!inputValue.value) {
				suggestions.value = [];
				return;
			}

			$.ajax({
				url: apiUrl,
				type: 'GET',
				data: {
					params,
					searchPhrase: inputValue.value,
				},
				error(r) {
					// TODO cb
					console.log('error');
				},
				success(r) {
					setSuggestions(r.items);
				},
			});
		}, 250)();
	}

	const autoSuggestProps = {
		id,
		inputProps,
		selectedLabel,
		isDisabled,
		deselectLabel,
		suggestions: suggestions.value,
		currentValue: currentValue,
		currentSelected: currentSelected.value,
	};

	return {
		autoSuggestProps,
		selectSuggestion,
		getSuggestions,
		deselect,
	};
}
