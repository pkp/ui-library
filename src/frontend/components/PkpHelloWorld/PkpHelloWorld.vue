<template>
	<div class="pkp-hello-world-container">
		<span>Hello world</span>
		<div>
			<PkpButton @click="openDialog1">open dialog</PkpButton>
		</div>
		<div>
			<PkpButton is-secondary @click="openModal1">open modal</PkpButton>
		</div>
		<div>
			<PkpAccordion title="Version 2">content</PkpAccordion>
		</div>
		<div><PkpDropdownActions :items="dropdownItems"></PkpDropdownActions></div>
		<div>
			<PkpTextarea
				v-model="textAreaValue"
				label="Please tell us why you want to report this comment"
			></PkpTextarea>
		</div>
	</div>
</template>
<script setup>
import {ref} from 'vue';
import PkpButton from '@/frontend/components/PkpButton/PkpButton.vue';
import PkpAccordion from '@/frontend/components/PkpAccordion/PkpAccordion.vue';
import PkpDropdownActions from '@/frontend/components/PkpDropdownActions/PkpDropdownActions.vue';
import {usePkpModal} from '@/frontend/composables/usePkpModal';
import PkpHelloWorldModal from '@/frontend/components/PkpHelloWorld/PkpHelloWorldModal.vue';
import PkpTextarea from '@/frontend/components/PkpTextarea/PkpTextarea.vue';
defineProps({one: {type: Object, required: true}});

const {openModal, openDialog} = usePkpModal();

const dropdownItems = [
	{label: 'Report', name: 'report'},
	{label: 'Delete', name: 'delete'},
];

function openDialog1() {
	openDialog({
		title: 'DialogTitle',
		message: 'Testing dialog',
		isDismissible: false,
		actions: [
			{
				label: 'Ok',
				callback: (close) => close(),
			},
		],
	});
}
function openModal1() {
	openModal(PkpHelloWorldModal);
}

const textAreaValue = ref('');
</script>
<style>
.pkp-hello-world-container {
	display: flex;
	flex-direction: column;
}
</style>
@/frontend/components/PkpTextArea/PkpTextarea.vue
