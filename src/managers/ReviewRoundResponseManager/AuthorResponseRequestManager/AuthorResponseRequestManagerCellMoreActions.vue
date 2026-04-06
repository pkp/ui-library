<template>
	<TableCell>
		<DropdownActions
			:label="t('common.moreActions')"
			button-variant="ellipsis"
			:actions="store.getAuthorItemActions({author, reviewRound})"
			@action="(actionName) => store[actionName](author)"
		/>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';
import {useLocalize} from '@/composables/useLocalize';
import {useReviewRoundAuthorResponseRequestStore} from './AuthorResponseRequestManagerStore';

const {t} = useLocalize();

defineProps({
	author: {
		type: Object,
		required: true,
	},
	reviewRound: {
		type: Object,
		required: true,
	},
});

const store = useReviewRoundAuthorResponseRequestStore();
</script>
