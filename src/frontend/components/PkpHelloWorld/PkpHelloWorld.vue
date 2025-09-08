```vue
<template>
	<div class="pkpHelloWorld__container">
		<span>Hello world</span>
		<div>
			<PkpButton @click="openDialog1">open dialog</PkpButton>
		</div>
		<div>
			<PkpButton @click="openDialog2">open dialog 2</PkpButton>
		</div>

		<div>
			<PkpButton is-secondary @click="openModal1">open modal</PkpButton>
		</div>
		<div>
			<PkpAccordion title="Version 2">content</PkpAccordion>
		</div>
		<div>
			<PkpDropdownMenu
				:items="dropdownItems"
				@select="handleSelect"
			></PkpDropdownMenu>
		</div>

		<div>
			<PkpTextarea
				v-model="textAreaValue"
				label="Please tell us why you want to report this comment"
			></PkpTextarea>
		</div>
	</div>
</template>

<script setup>
import {ref, watch} from 'vue';
import PkpButton from '@/frontend/components/PkpButton/PkpButton.vue';
import PkpAccordion from '@/frontend/components/PkpAccordion/PkpAccordion.vue';
import PkpDropdownMenu from '@/frontend/components/PkpDropdownMenu/PkpDropdownMenu.vue';

import {usePkpModal} from '@/frontend/composables/usePkpModal';
import PkpTextarea from '@/frontend/components/PkpTextarea/PkpTextarea.vue';

defineProps({
	commentsInit: {type: Object, required: true},
	one: {type: Object, required: true},
});

const {openDialog} = usePkpModal();
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
				callback: (close) => openDialog2(),
			},
		],
	});
}

function openDialog2() {
	openDialog({
		title: 'DialogTitle2',
		message: 'Testing dialog2',
		isDismissible: false,
		actions: [
			{
				label: 'Ok',
				callback: (close) => close(),
			},
		],
	});
}

function handleSelect(item) {
	console.log('selecting stuff', item);
}

const textAreaValue = ref('');
watch(textAreaValue, (newValue) => console.log('newValue:', newValue));
</script>

<style>
.pkpHelloWorld__container {
	display: flex;
	flex-direction: column;
}
</style>
