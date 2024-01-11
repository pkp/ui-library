<template>
	<SideModal close-label="Close" :open="isOpened" @close="close">
		<SideModalBodyAjax :options="options" />
		<SideModal close-label="Close" :open="isOpened2" @close="close2">
			<SideModalBodyAjax :options="options2" />
		</SideModal>
	</SideModal>
	<PkpDialog></PkpDialog>
</template>

<script setup>
import {ref} from 'vue';
import SideModal from '@/components/Modal/SideModal.vue';
import SideModalBodyAjax from '@/components/Modal/SideModalBodyAjax.vue';
import PkpDialog from '@/components/Modal/Dialog.vue';

const isOpened = ref(false);
const isOpened2 = ref(false);

const options = ref(null);
const options2 = ref(null);

function close() {
	isOpened.value = false;
	options.value = null;
}

function close2() {
	isOpened2.value = false;
	options2.value = null;
}

// 			pkp.eventBus.$emit('open-tab', tab);

/** POC, its disabled for now, it will handle legacy modals in future to improve their accessibility */
pkp.eventBus.$on('open-modal-vue', (_options) => {
	if (options.value) {
		options2.value = _options;
		isOpened2.value = true;
		return;
	}
	options.value = _options;
	isOpened.value = true;
});
</script>
