import {useModalStore} from '@/stores/modalStore';

export function useDialog() {
	const modalStore = useModalStore();

	function openDialog(props) {
		modalStore.openDialog(props);
	}

	return {openDialog};
}
