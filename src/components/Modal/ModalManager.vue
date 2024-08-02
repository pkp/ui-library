<template>
	<SideModal
		close-label="Close"
		:open="sideModal1?.opened || false"
		:modal-level="1"
		@close="() => close(sideModal1?.modalId)"
	>
		<component :is="component1" v-bind="sideModal1?.props" />
		<PkpDialog
			:opened="dialogOpened && dialogLevel === 1"
			v-bind="dialogProps"
			@close="closeDialog"
		></PkpDialog>

		<SideModal
			close-label="Close"
			:modal-level="2"
			:open="sideModal2?.opened || false"
			@close="() => close(sideModal2?.modalId)"
		>
			<component :is="component2" v-bind="sideModal2?.props" />
			<PkpDialog
				:opened="dialogOpened && dialogLevel === 2"
				v-bind="dialogProps"
				@close="closeDialog"
			></PkpDialog>
			<SideModal
				close-label="Close"
				:modal-level="3"
				:open="sideModal3?.opened || false"
				@close="() => close(sideModal3?.modalId)"
			>
				<component :is="component3" v-bind="sideModal3?.props" />
			</SideModal>
		</SideModal>
	</SideModal>
	<PkpDialog
		:opened="dialogOpened && dialogLevel === 0"
		v-bind="dialogProps"
		@close="closeDialog"
	></PkpDialog>
</template>

<script setup>
import {computed} from 'vue';
import {useModalStore} from '@/stores/modalStore';
import {storeToRefs} from 'pinia';
import SideModal from '@/components/Modal/SideModal.vue';
import LegacyAjax from '@/components/Modal/SideModalBodyLegacyAjax.vue';
import PkpDialog from '@/components/Modal/Dialog.vue';
import WorkflowLogResponseForModal from '@/pages/workflow/WorkflowLogResponseForModal.vue';

const GlobalModals = {LegacyAjax, WorkflowLogResponseForModal};

const modalStore = useModalStore();
const {
	sideModal1,
	sideModal2,
	sideModal3,
	dialogProps,
	dialogOpened,
	dialogLevel,
} = storeToRefs(useModalStore());

// Component can be either string or vue component
const component1 = computed(() => {
	if (!sideModal1.value?.component) {
		return null;
	}
	return GlobalModals[sideModal1.value.component] || sideModal1.value.component;
});

const component2 = computed(() => {
	if (!sideModal2.value?.component) {
		return null;
	}
	return GlobalModals[sideModal2.value.component] || sideModal2.value.component;
});

const component3 = computed(() => {
	if (!sideModal3.value?.component) {
		return null;
	}
	return GlobalModals[sideModal3.value.component] || sideModal3.value.component;
});

function close(modalId) {
	modalStore.closeSideModalById(true, modalId);
}

function closeDialog() {
	modalStore.closeDialog();
}
</script>
