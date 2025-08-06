import {defineStore} from 'pinia';
import {ref} from 'vue'; // Import necessary Composition API functions

export const usePageStore = defineStore('pkpPage', () => {
	// State: Use ref() for reactive state
	const data = ref(null); // Initial value; can be changed to {}, [], or any type as needed

	// Actions: Define functions to mutate state
	function setData(newData) {
		data.value = newData;
	}

	// Return the public interface
	return {data, setData};
});
