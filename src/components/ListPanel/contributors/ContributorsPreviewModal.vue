<template>
	<SideModalBody>
		<template #title>
			{{ t('submission.contributors') }}
		</template>
		<SideModalLayoutBasic>
			<p>
				{{ t('contributor.listPanel.preview.description') }}
			</p>
			<PkpTable>
				<TableHeader>
					<TableColumn>
						{{ t('contributor.listPanel.preview.format') }}
					</TableColumn>
					<TableColumn>
						{{ t('contributor.listPanel.preview.display') }}
					</TableColumn>
				</TableHeader>
				<TableBody>
					<TableRow>
						<TableCell>
							{{ t('contributor.listPanel.preview.abbreviated') }}
						</TableCell>
						<TableCell>{{ publication.authorsStringShort }}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>
							{{ t('contributor.listPanel.preview.publicationLists') }}
						</TableCell>
						<TableCell>
							{{ publication.authorsStringIncludeInBrowse }}
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>{{ t('contributor.listPanel.preview.full') }}</TableCell>
						<TableCell>{{ publication.authorsString }}</TableCell>
					</TableRow>
				</TableBody>
			</PkpTable>
		</SideModalLayoutBasic>
	</SideModalBody>
</template>

<script setup>
import PkpTable from '@/components/Table/Table.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableRow from '@/components/Table/TableRow.vue';
import TableCell from '@/components/Table/TableCell.vue';
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import {useLocalize} from '@/composables/useLocalize';

defineProps({
	publication: {type: Object, required: true},
});

const {t} = useLocalize();
</script>
