import {ref, inject} from 'vue';

export function useAutosuggest(emit) {
	const allowCustom = inject('allowCustom', false);
	const localInputValue = ref('');
	const isFocused = ref(false);

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

	return {
		allowCustom,
		localInputValue,
		isFocused,
		handleChange,
		handleFocus,
		handleBlur,
	};
}
