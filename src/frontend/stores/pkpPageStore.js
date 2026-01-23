import {defineStore} from 'pinia';
import {ref} from 'vue';

export const usePageStore = defineStore('pkpPage', () => {
	const data = ref(null);

	function setData(newData) {
		data.value = newData;
	}

	return {data, setData};
});
