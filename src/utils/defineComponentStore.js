import {defineStore, getActivePinia} from 'pinia';
import {
	onMounted,
	onBeforeUnmount,
	provide,
	inject,
	getCurrentInstance,
} from 'vue';

let storesMap = {};

export function getComponentStoreByName(storeName) {
	return storesMap[storeName].useStore();
}

/**
 * This is replacement for `inject` method offered from vue, to be used inside pinia "component stores"
 * Component stores follow component life cycle for great convinience, but this is not common
 * use case. Pinia stores are mostly used as global stores independent from components.
 *
 * With recent change in vue (https://github.com/vuejs/core/issues/11488),
 * inject used within pinia defaults to injecting from root app component provides, instead
 * of current instance. Therefore using custom implementation to get current instance provides.
 *
 *
 */
export function injectFromCurrentInstance(name) {
	const instance = getCurrentInstance();
	const provides = instance
		? instance.parent == null
			? instance.vnode.appContext && instance.vnode.appContext.provides
			: instance.parent.provides
		: void 0;

	return provides?.[name];
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
