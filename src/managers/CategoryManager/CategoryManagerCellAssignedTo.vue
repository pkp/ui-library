<template>
	<TableCell>
		<span>
			{{
				category.assignedEditors
					.map((editor) => editor.name)
					.join(t('common.commaListSeparator'))
			}}
		</span>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';
import {useLocalize} from '@/composables/useLocalize';
const {t} = useLocalize();

defineProps({category: {type: Object, required: true}});
</script>
