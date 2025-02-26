<template>
	<SideModal
		:key="sideModal1?.modalId"
		:data-cy="
			activeModalId === sideModal1?.modalId ? 'active-modal' : undefined
		"
		close-label="Close"
		:open="sideModal1?.opened || false"
		:modal-level="1"
		@close="(returnData) => close(sideModal1?.modalId, returnData)"
	>
		<component :is="component1" v-bind="sideModal1?.props" />
		<PkpDialog
			:key="JSON.stringify(dialogProps)"
			:opened="dialogOpened && dialogLevel === 1"
			v-bind="dialogProps"
			@close="closeDialog"
		></PkpDialog>

		<SideModal
			:key="sideModal2?.modalId"
			close-label="Close"
			:data-cy="
				activeModalId === sideModal2?.modalId ? 'active-modal' : undefined
			"
			:modal-level="2"
			:open="sideModal2?.opened || false"
			@close="(returnData) => close(sideModal2?.modalId, returnData)"
		>
			<component
				:is="component2"
				:key="sideModal2?.modalId"
				v-bind="sideModal2?.props"
			/>
			<PkpDialog
				:key="JSON.stringify(dialogProps)"
				:opened="dialogOpened && dialogLevel === 2"
				v-bind="dialogProps"
				@close="closeDialog"
			></PkpDialog>
			<SideModal
				:data-cy="
					activeModalId === sideModal3?.modalId ? 'active-modal' : undefined
				"
				close-label="Close"
				:modal-level="3"
				:open="sideModal3?.opened || false"
				@close="(returnData) => close(sideModal3?.modalId, returnData)"
			>
				<component
					:is="component3"
					:key="sideModal3?.modalId"
					v-bind="sideModal3?.props"
				/>
				<PkpDialog
					:key="JSON.stringify(dialogProps)"
					:opened="dialogOpened && dialogLevel === 3"
					v-bind="dialogProps"
					@close="closeDialog"
				></PkpDialog>
				<SideModal
					:data-cy="
						activeModalId === sideModal4?.modalId ? 'active-modal' : undefined
					"
					close-label="Close"
					:modal-level="4"
					:open="sideModal4?.opened || false"
					@close="(returnData) => close(sideModal4?.modalId, returnData)"
				>
					<component
						:is="component4"
						:key="sideModal4?.modalId"
						v-bind="sideModal4?.props"
					/>
					<PkpDialog
						:key="JSON.stringify(dialogProps)"
						:opened="dialogOpened && dialogLevel === 4"
						v-bind="dialogProps"
						@close="closeDialog"
					></PkpDialog>
				</SideModal>
			</SideModal>
		</SideModal>
	</SideModal>
	<PkpDialog
		:key="JSON.stringify(dialogProps)"
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
import WorkflowLogResponseModal from '@/managers/ReviewerManager/modals/WorkflowLogResponseModal.vue';

const GlobalModals = {LegacyAjax, WorkflowLogResponseModal};

const modalStore = useModalStore();
const {
	sideModal1,
	sideModal2,
	sideModal3,
	sideModal4,
	dialogProps,
	dialogOpened,
	dialogLevel,
} = storeToRefs(useModalStore());

const activeModalId = computed(() => {
	if (sideModal4.value?.opened) {
		return sideModal4.value.modalId;
	} else if (sideModal3.value?.opened) {
		return sideModal3.value.modalId;
	} else if (sideModal2.value?.opened) {
		return sideModal2.value.modalId;
	} else if (sideModal1.value?.opened) {
		return sideModal1.value.modalId;
	}

	return null;
});

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

const component4 = computed(() => {
	if (!sideModal4.value?.component) {
		return null;
	}
	return GlobalModals[sideModal4.value.component] || sideModal4.value.component;
});

function close(modalId, returnData) {
	modalStore.closeSideModalById(true, modalId, returnData);
}

function closeDialog() {
	modalStore.closeDialog();
}
</script>
