import {defineStore, getActivePinia} from 'pinia';
import {onMounted, onUnmounted} from 'vue';

export function defineComponentStore(storeName, setupFn) {
	let useStore = null;
	let mountedCount = 0;
	return function (initConfig) {
		onMounted(() => {
			mountedCount = mountedCount + 1;
			//console.log(`store ${storeName} mounted ${mountedCount}`);
		});
		onUnmounted(() => {
			mountedCount = mountedCount - 1;
			//console.log(`store ${storeName} unmounted ${mountedCount}`);
			if (mountedCount === 0) {
				//console.log(`cleaning up ${storeName} store.`);
				const store = useStore();
				store.$dispose();
				useStore = null;
				delete getActivePinia().state.value[store.$id];
			}
		});

		function setupFnWrapper() {
			return setupFn(initConfig);
		}

		if (!useStore) {
			useStore = defineStore(storeName, setupFnWrapper);
		}
		return useStore();
	};
}
