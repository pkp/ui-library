import {ref, inject} from 'vue';

export function useAutosuggest(
	_inputProps = {},
	_id = '',
	_suggestions = [],
	_selectedLabel = '',
	_currentValue = '',
	_currentSelected = [],
	_isDisabled = false,
	_deselectLabel = '',
) {
	const allowCustom = inject('allowCustom', false);
	const localInputValue = ref('');
	const isFocused = ref(false);

	const inputProps = ref(_inputProps);
	const id = ref(_id);
	const suggestions = ref(_suggestions);
	const selectedLabel = ref(_selectedLabel);
	const currentValue = ref(_currentValue);
	const currentSelected = ref(_currentSelected);
	const isDisabled = ref(_isDisabled);
	const deselectLabel = ref(_deselectLabel);

	function handleChange(event, emit) {
		localInputValue.value = event.target.value.trim();
		emit('update:inputValue', localInputValue.value);
	}

	function handleFocus(emit) {
		isFocused.value = true;
		emit('update:isFocused', isFocused.value);
	}

	function handleBlur(emit) {
		isFocused.value = false;
		emit('update:isFocused', isFocused.value);
	}

	const autoSuggestProps = {
		inputProps: inputProps.value,
		id: id.value,
		suggestions: suggestions.value,
		selectedLabel: selectedLabel.value,
		currentValue: currentValue.value,
		currentSelected: currentSelected.value,
		isDisabled: isDisabled.value,
		deselectLabel: deselectLabel.value,
	};

	return {
		allowCustom,
		localInputValue,
		isFocused,
		handleChange,
		handleFocus,
		handleBlur,
		autoSuggestProps,
	};
}
