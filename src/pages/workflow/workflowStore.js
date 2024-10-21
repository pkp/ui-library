import {getComponentStoreByName} from '@/utils/defineComponentStore';
export function useWorkflowStore() {
	return getComponentStoreByName('workflow');
}
