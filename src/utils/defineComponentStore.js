import {defineStore, getActivePinia} from 'pinia';
import {onMounted, onBeforeUnmount, provide, inject} from 'vue';

let storesMap = {};

export function getComponentStoreByName(storeName) {
	return storesMap[storeName].useStore();
}

export function defineComponentStore(
	_storeName,
	setupFn,
	{requireNamespace} = {},
) {
	return function (initConfig, _namespace = '') {
		if (!_namespace && requireNamespace) {
			const injectedNamespace = inject(_storeName)?.namespace;
			if (injectedNamespace) {
				_namespace = injectedNamespace;
			}
		}
		const storeName = _namespace ? `${_storeName}_${_namespace}` : _storeName;

		if (!storesMap[storeName]) {
			storesMap[storeName] = {mountedCount: 0, useStore: null};
		}
		onMounted(() => {
			storesMap[storeName].mountedCount = storesMap[storeName].mountedCount + 1;
		});
		onBeforeUnmount(() => {
			storesMap[storeName].mountedCount = storesMap[storeName].mountedCount - 1;

			if (storesMap[storeName].mountedCount === 0) {
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
			if (requireNamespace) {
				provide(_storeName, {namespace: _namespace || null});
			}

			storesMap[storeName].useStore = defineStore(storeName, setupFnWrapper);
		}

		return storesMap[storeName].useStore();
	};
}
