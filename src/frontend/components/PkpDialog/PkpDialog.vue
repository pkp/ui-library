<template>
	<PkpBaseDialog v-bind="$attrs">
		<PkpBaseDialogOverlay
			class="data-[state=open]:animate-overlayShow fixed inset-0 z-30 bg-tertiary"
		></PkpBaseDialogOverlay>
		<PkpBaseDialogContent
			class="data-[state=open]:animate-contentShow bg-white fixed left-[50%] top-[50%] z-[100] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none"
		>
			<PkpBaseDialogTitle></PkpBaseDialogTitle>
			<PkpBaseDialogBody></PkpBaseDialogBody>
			<PkpBaseDialogActionButtons></PkpBaseDialogActionButtons>
		</PkpBaseDialogContent>
	</PkpBaseDialog>
</template>

<script setup>
import PkpBaseDialog from './PkpBaseDialog.vue';
import PkpBaseDialogContent from './PkpBaseDialogContent.vue';
import PkpBaseDialogOverlay from './PkpBaseDialogOverlay.vue';
import PkpBaseDialogTitle from './PkpBaseDialogTitle.vue';
import PkpBaseDialogBody from './PkpBaseDialogBody.vue';
import PkpBaseDialogActionButtons from './PkpBaseDialogActionButtons.vue';

//defineProps({title: {type: String, required: true}});
</script>
