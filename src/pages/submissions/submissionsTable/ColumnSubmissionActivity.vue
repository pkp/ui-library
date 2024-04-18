<template>
	<TableCell>
		<component
			:is="CellContentComponents[cellConfig.component] || cellConfig.component"
			v-bind="cellConfig.props"
			@action="
				(actionName, actionArgs) =>
					handleItemAction(actionName, {...actionArgs, submissionId: item.id})
			"
		/>
	</TableCell>
</template>

<script setup>
import CellContentActivityAlert from './CellContentActivityAlert.vue';
import CellContentActivityReviews from './CellContentActivityReviews.vue';
import {defineProps, computed} from 'vue';
import TableCell from '@/components/TableNext/TableCell.vue';

import {useSubmissionsPageStore} from '@/pages/submissions/submissionsPageStore';

const CellContentComponents = {
	CellContentActivityAlert,
	CellContentActivityReviews,
};

const {getEditorialActivityForEditorConfig, handleItemAction} =
	useSubmissionsPageStore();
const props = defineProps({item: {type: Object, required: true}});

const cellConfig = computed(() => {
	return getEditorialActivityForEditorConfig(props.item);
});
</script>
