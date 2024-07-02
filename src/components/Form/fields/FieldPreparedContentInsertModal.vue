<template>
	<SideModalBody>
		<template #title>
			{{ title }}
		</template>
		<SideModalLayoutBasic>
			<InsertContent
				ref="insertContent"
				:insert-label="insertLabel"
				:items="preparedContent"
				:items-label="preparedContentLabel"
				:search-label="searchLabel"
				@insert="(...args) => emit('insert', ...args)"
			/>
		</SideModalLayoutBasic>
	</SideModalBody>
</template>

<script setup>
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import InsertContent from '@/components/InsertContent/InsertContent.vue';

defineProps({
	title: {type: String, required: true},
	insertLabel: {type: String, required: true},
	preparedContent: {type: Array, required: false, default: () => []},
	preparedContentLabel: {type: String, required: true},
	searchLabel: {type: String, default: ''},
});

const emit = defineEmits(['insert']);
</script>
