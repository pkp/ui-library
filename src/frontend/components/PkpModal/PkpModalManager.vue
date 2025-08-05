<template>
	<PkpModal
		:key="modal1?.modalId"
		:data-cy="activeModalId === modal1?.modalId ? 'active-modal' : undefined"
		close-label="Close"
		:open="modal1?.opened || false"
		:modal-level="1"
		@close="(returnData) => close(modal1?.modalId, returnData)"
	>
		<component :is="component1" v-bind="modal1?.props" />
		<PkpDialog
			:key="JSON.stringify(dialogProps)"
			:opened="dialogOpened && dialogLevel === 1"
			v-bind="dialogProps"
			@close="closeDialog"
		></PkpDialog>

		<PkpModal
			:key="modal2?.modalId"
			close-label="Close"
			:data-cy="activeModalId === modal2?.modalId ? 'active-modal' : undefined"
			:modal-level="2"
			:open="modal2?.opened || false"
			@close="(returnData) => close(modal2?.modalId, returnData)"
		>
			<component
				:is="component2"
				:key="modal2?.modalId"
				v-bind="modal2?.props"
			/>
			<PkpDialog
				:key="JSON.stringify(dialogProps)"
				:opened="dialogOpened && dialogLevel === 2"
				v-bind="dialogProps"
				@close="closeDialog"
			></PkpDialog>
			<PkpModal
				:data-cy="
					activeModalId === modal3?.modalId ? 'active-modal' : undefined
				"
				close-label="Close"
				:modal-level="3"
				:open="modal3?.opened || false"
				@close="(returnData) => close(modal3?.modalId, returnData)"
			>
				<component
					:is="component3"
					:key="modal3?.modalId"
					v-bind="modal3?.props"
				/>
				<PkpDialog
					:key="JSON.stringify(dialogProps)"
					:opened="dialogOpened && dialogLevel === 3"
					v-bind="dialogProps"
					@close="closeDialog"
				></PkpDialog>
				<PkpModal
					:data-cy="
						activeModalId === modal4?.modalId ? 'active-modal' : undefined
					"
					close-label="Close"
					:modal-level="4"
					:open="modal4?.opened || false"
					@close="(returnData) => close(modal4?.modalId, returnData)"
				>
					<component
						:is="component4"
						:key="modal4?.modalId"
						v-bind="modal4?.props"
					/>
					<PkpDialog
						:key="JSON.stringify(dialogProps)"
						:opened="dialogOpened && dialogLevel === 4"
						v-bind="dialogProps"
						@close="closeDialog"
					></PkpDialog>
				</PkpModal>
			</PkpModal>
		</PkpModal>
	</PkpModal>
	<PkpDialog
		:key="JSON.stringify(dialogProps)"
		:opened="dialogOpened && dialogLevel === 0"
		v-bind="dialogProps"
		@close="closeDialog"
	></PkpDialog>
</template>

<script setup>
import {computed} from 'vue';
import {usePkpModalStore} from '@/frontend/stores/pkpModalStore';
import {storeToRefs} from 'pinia';
import PkpModal from '@/frontend/components/PkpModal/PkpModal.vue';
import PkpDialog from '@/frontend/components/PkpModal/PkpDialog.vue';

const modalStore = usePkpModalStore();
const {modal1, modal2, modal3, modal4, dialogProps, dialogOpened, dialogLevel} =
	storeToRefs(usePkpModalStore());

const activeModalId = computed(() => {
	if (modal4.value?.opened) {
		return modal4.value.modalId;
	} else if (modal3.value?.opened) {
		return modal3.value.modalId;
	} else if (modal2.value?.opened) {
		return modal2.value.modalId;
	} else if (modal1.value?.opened) {
		return modal1.value.modalId;
	}

	return null;
});

// Component can be either string or vue component
const component1 = computed(() => {
	if (!modal1.value?.component) {
		return null;
	}
	return modal1.value.component;
});

const component2 = computed(() => {
	if (!modal2.value?.component) {
		return null;
	}
	return modal2.value.component;
});

const component3 = computed(() => {
	if (!modal3.value?.component) {
		return null;
	}
	return modal3.value.component;
});

const component4 = computed(() => {
	if (!modal4.value?.component) {
		return null;
	}
	return modal4.value.component;
});

function close(modalId, returnData) {
	modalStore.closeModalById(modalId, returnData);
}

function closeDialog() {
	modalStore.closeDialog();
}
</script>
