<template>
	<TableCell>
		<DropdownActions
			:actions="store.getItemActions({user})"
			:label="t('userAccess.management.options')"
			button-variant="ellipsis"
			direction="left"
			@action="(actionName) => store[actionName]({user})"
		/>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';
import {useUserAccessManagerStore} from './UserAccessManagerStore.js';
import {useTranslation} from '@/composables/useTranslation';

defineProps({
	user: {type: Object, required: true},
});

const store = useUserAccessManagerStore();
const {t} = useTranslation();
</script>
