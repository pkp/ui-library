<template>
	<TableCell>
		<DropdownActions
			:label="t('common.moreActions')"
			button-variant="ellipsis"
			:actions="itemPrimaryActions"
			@action="handleAction"
		/>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';
import {useCitationManagerStore} from './citationManagerStore';
import {computed} from 'vue';
import {t} from '@/utils/i18n';

const props = defineProps({
	submission: {type: Object, required: true},
	publication: {type: Object, required: true},
});

const citationManagerStore = useCitationManagerStore();

const itemPrimaryActions = computed(() =>
	citationManagerStore.getItemPrimaryActions({
		submission: props.submission,
		publication: props.publication,
	}),
);

function handleAction(actionName) {
	citationManagerStore[actionName]({
		publication: props.publication
	});
}
</script>
