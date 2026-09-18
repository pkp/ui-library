import {describe, test, expect, beforeEach, vi} from 'vitest';
import {setActivePinia, createPinia} from 'pinia';

import {useModalStore} from './modalStore';

global.pkp = global.pkp || {};

describe('modalStore data changes', () => {
	let modalStore;

	beforeEach(() => {
		setActivePinia(createPinia());
		modalStore = useModalStore();
	});

	function openModal() {
		const onClose = vi.fn();
		modalStore.openSideModal('TestModal', {}, {onClose});

		return {onClose};
	}

	function getModalId(level) {
		return modalStore[`sideModal${level}`].modalId;
	}

	test('closing without changes does not reload, whatever the caller passes', async () => {
		const {onClose} = openModal();

		await modalStore.closeSideModalById(false, getModalId(1), {
			dataChanged: true,
		});

		expect(onClose).toHaveBeenCalledWith({dataChanged: false});
	});

	test('closing after a change reloads and keeps legacy dataChanged payloads', async () => {
		const {onClose} = openModal();

		modalStore.markModalDataChanged(1);
		await modalStore.closeSideModalById(false, getModalId(1), {
			dataChanged: [42],
		});

		expect(onClose).toHaveBeenCalledWith({dataChanged: [42]});
	});

	test('a change in a nested modal is a change in its parent', async () => {
		const {onClose: onParentClose} = openModal();
		openModal();

		modalStore.markModalDataChanged(2);
		await modalStore.closeSideModalById(false, getModalId(2));
		await modalStore.closeSideModalById(false, getModalId(1));

		expect(onParentClose).toHaveBeenCalledWith({dataChanged: true});
	});

	test('a slow reload does not keep the closed modal around', async () => {
		let finishReload;
		const onClose = vi.fn(
			() => new Promise((resolve) => (finishReload = resolve)),
		);
		modalStore.openSideModal('TestModal', {}, {onClose});
		modalStore.markModalDataChanged(1);

		const closing = modalStore.closeSideModalById(false, getModalId(1));
		await new Promise((resolve) => setTimeout(resolve, 500));

		expect(modalStore.sideModal1).toBeNull();

		finishReload();
		await closing;
	});
});
