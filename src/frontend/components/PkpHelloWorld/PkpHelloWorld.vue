<template>
	<span>Hello world</span>
	<PkpButton @click="openDialog1">open dialog</PkpButton>
	<PkpButton is-secondary @click="openModal1">open modal</PkpButton>
	<PkpAccordion title="Version 2">content</PkpAccordion>
</template>
<script setup>
import PkpButton from '@/frontend/components/PkpButton/PkpButton.vue';
import PkpAccordion from '../PkpAccordion/PkpAccordion.vue';
import {usePkpModal} from '@/frontend/composables/usePkpModal';
import PkpHelloWorldModal from '@/frontend/components/PkpHelloWorld/PkpHelloWorldModal.vue';
defineProps({one: {type: Object, required: true}});

const {openModal, openDialog} = usePkpModal();

function openDialog1() {
	openDialog({
		title: 'DialogTitle',
		message: 'Testing dialog',
		actions: [
			{
				label: 'Ok',
			},
		],
	});
}
function openModal1() {
	openModal(PkpHelloWorldModal);
}
</script>
<style></style>
