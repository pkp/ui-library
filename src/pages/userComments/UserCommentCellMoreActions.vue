<template>
	<TableCell>
		<DropdownActions
			:label="t('common.moreActions')"
			button-variant="ellipsis"
			:actions="userCommentStore.getCommentItemActions({comment: item})"
			@action="(actionName) => userCommentStore[actionName](item)"
		/>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';
import {useUserCommentStore} from '@/pages/userComments/userCommentStore';
import {useLocalize} from '@/composables/useLocalize';

const {t} = useLocalize();
const userCommentStore = useUserCommentStore();

defineProps({
	item: {
		type: Object,
		required: true,
	},
});
</script>
