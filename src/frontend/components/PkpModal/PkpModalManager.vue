<template>
	<pkp-dialog
		v-if="modal1?.props"
		:key="modal1?.modalId"
		close-label="Close"
		:open="modal1?.opened || false"
		v-bind="modal1?.props"
		@close="(returnData) => close(modal1?.modalId, returnData)"
	></pkp-dialog>
	<pkp-dialog
		v-if="modal2?.props"
		:key="modal2?.modalId"
		close-label="Close"
		:open="modal2?.opened || false"
		v-bind="modal2?.props"
		@close="(returnData) => close(modal2?.modalId, returnData)"
	></pkp-dialog>
	<pkp-dialog
		v-if="modal3?.props"
		:key="modal3?.modalId"
		close-label="Close"
		:open="modal3?.opened || false"
		v-bind="modal3?.props"
		@close="(returnData) => close(modal3?.modalId, returnData)"
	></pkp-dialog>
</template>

<script setup>
import {usePkpModalStore} from '@/frontend/stores/pkpModalStore';
import {storeToRefs} from 'pinia';

const modalStore = usePkpModalStore();
const {modal1, modal2, modal3} = storeToRefs(usePkpModalStore());

function close(modalId, returnData) {
	console.log('close manager triggered');
	modalStore.closeModalById(modalId, returnData);
}
</script>
