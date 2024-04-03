<template>
	<SideModal
		close-label="Close"
		:open="sideModal1?.opened || false"
		@close="close"
	>
		<component :is="component1" v-bind="sideModal1?.props" />
		<SideModal
			close-label="Close"
			:open="sideModal2?.opened || false"
			@close="close"
		>
			<component :is="component2" v-bind="sideModal2?.props" />
		</SideModal>
		-->

		<!--<SideModalBodyAjax :options="options" />
		<SideModal close-label="Close" :open="isOpened2" @close="close2">
			<SideModalBodyAjax :options="options2" />
		</SideModal>-->
	</SideModal>
	<PkpDialog></PkpDialog>
</template>

<script setup>
/* eslint-disable */

import {computed} from 'vue';
import {useModalStore} from '@/stores/modalStore';
import {storeToRefs} from 'pinia';
import SideModal from '@/components/Modal/SideModal.vue';
import LegacyAjax from '@/components/Modal/SideModalBodyLegacyAjax.vue';
import PkpDialog from '@/components/Modal/Dialog.vue';

const LegacyModals = {LegacyAjax};

const modalStore = useModalStore();
const {sideModal1, sideModal2, sideModal3} = storeToRefs(useModalStore());
const component1 = computed(() => {
	if (!sideModal1.value?.component) {
		return null;
	}
	return typeof sideModal1.value.component === 'string'
		? LegacyModals[sideModal1.value.component]
		: sideModal1.value.component;
});

const component2 = computed(() => {
	if (!sideModal2.value?.component) {
		return null;
	}
	return typeof sideModal2.value.component === 'string'
		? LegacyModals[sideModal2.value.component]
		: sideModal2.value.component;
});

function close() {
	modalStore.closeSideModal();
}

// 			pkp.eventBus.$emit('open-tab', tab);
</script>
