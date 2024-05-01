import {defineStore, getActivePinia} from 'pinia';
import {onMounted, onUnmounted} from 'vue';

export function defineComponentStore(_storeName, setupFn) {
	let storesMap = {};

	return function (initConfig, _namespace = '') {
		const storeName = _namespace ? `${_storeName}_${_namespace}` : _storeName;
		if (!storesMap[storeName]) {
			storesMap[storeName] = {mountedCount: 0, useStore: null};
		}
		onMounted(() => {
			storesMap[storeName].mountedCount = storesMap[storeName].mountedCount + 1;
			//console.log(`store ${storeName} mounted ${mountedCount}`);
		});
		onUnmounted(() => {
			storesMap[storeName].mountedCount = storesMap[storeName].mountedCount - 1;

			//console.log(`store ${storeName} unmounted ${mountedCount}`);
			if (storesMap[storeName].mountedCount === 0) {
				//console.log(`cleaning up ${storeName} store.`);
				const store = storesMap[storeName].useStore();
				store.$dispose();
				storesMap[storeName] = null;
				delete getActivePinia().state.value[store.$id];
			}
		});

		function setupFnWrapper() {
			return setupFn(initConfig);
		}

		if (!storesMap[storeName].useStore) {
			storesMap[storeName].useStore = defineStore(storeName, setupFnWrapper);
		}
		return storesMap[storeName].useStore();
	};
}
