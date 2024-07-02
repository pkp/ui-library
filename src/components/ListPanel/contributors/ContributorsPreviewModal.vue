<template>
	<SideModalBody>
		<template #title>
			{{ t('submission.contributors') }}
		</template>
		<SideModalLayoutBasic>
			<p>
				{{ t('contributor.listPanel.preview.description') }}
			</p>
			<table class="pkpTable">
				<thead>
					<tr>
						<th>{{ t('contributor.listPanel.preview.format') }}</th>
						<th>{{ t('contributor.listPanel.preview.display') }}</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>{{ t('contributor.listPanel.preview.abbreviated') }}</td>
						<td>{{ publication.authorsStringShort }}</td>
					</tr>
					<tr>
						<td>
							{{ t('contributor.listPanel.preview.publicationLists') }}
						</td>
						<td>{{ publication.authorsStringIncludeInBrowse }}</td>
					</tr>
					<tr>
						<td>{{ t('contributor.listPanel.preview.full') }}</td>
						<td>{{ publication.authorsString }}</td>
					</tr>
				</tbody>
			</table>
		</SideModalLayoutBasic>
	</SideModalBody>
</template>

<script setup>
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import {useLocalize} from '@/composables/useLocalize';

defineProps({
	publication: {type: Object, required: true},
});

const {t} = useLocalize();
</script>
