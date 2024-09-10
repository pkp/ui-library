<template>
	<PkpTable>
		<template #label>{{ t('submission.layout.galleys') }}</template>
		<template #bottom-controls>
			<div class="space-x-y flex">
				<PkpButton
					v-for="action in galleyManagerStore.bottomActions"
					:key="action.name"
					class="-ms-3"
					is-link
					@click="galleyManagerStore.handleAction(action.name)"
				>
					{{ action.label }}
				</PkpButton>
			</div>
		</template>
		<TableHeader>
			<TableColumn>{{ t('common.name') }}</TableColumn>
			<TableColumn>{{ t('common.language') }}</TableColumn>
			<TableColumn>
				<span class="sr-only">{{ t('common.moreActions') }}</span>
			</TableColumn>
		</TableHeader>
		<TableBody>
			<GalleyManagerTableRow
				v-for="galley in galleyManagerStore.galleys"
				:key="galley.id"
				:galley="galley"
				:metadata-locales="submission.metadataLocales"
				:item-actions="galleyManagerStore.itemActions"
				@action="galleyManagerStore.handleAction"
			></GalleyManagerTableRow>
		</TableBody>
	</PkpTable>
</template>

<script setup>
import {useLocalize} from '@/composables/useLocalize';
import {useGalleyManagerStore} from './galleyManagerStore';
import PkpTable from '@/components/TableNext/Table.vue';
import TableColumn from '@/components/TableNext/TableColumn.vue';
import TableHeader from '@/components/TableNext/TableHeader.vue';
import TableBody from '@/components/TableNext/TableBody.vue';
import GalleyManagerTableRow from './GalleyManagerTableRow.vue';
import PkpButton from '@/components/Button/Button.vue';

const props = defineProps({
	publication: {type: Object, required: true},
	submission: {type: Object, required: true},
});

const {t} = useLocalize();

const galleyManagerStore = useGalleyManagerStore(props);
</script>
