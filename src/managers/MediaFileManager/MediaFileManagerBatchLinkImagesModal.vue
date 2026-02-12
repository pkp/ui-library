<template>
	<SideModalBody>
		<template #title>
			{{ t('publication.mediaFiles.batchLinkImages') }}
		</template>
		<template #description>
			<span class="text-lg-medium">
				{{ t('publication.mediaFiles.batchLinkImages.description') }}
			</span>
		</template>
		<div class="flex min-h-full flex-col p-4">
			<div class="flex-grow bg-secondary p-4">
				<div v-if="isLoadingMediaFiles" class="flex justify-center py-8">
					<Spinner />
				</div>
				<PkpTable
					v-else
					:aria-label="t('publication.mediaFiles.batchLinkImages')"
				>
					<TableHeader>
						<TableColumn>
							{{ t('publication.mediaFiles.selectedWebVersion') }}
						</TableColumn>
						<TableColumn>
							{{ t('publication.mediaFiles.linkHighResolutionVersion') }}
						</TableColumn>
					</TableHeader>
					<TableBody>
						<TableRow v-for="webFile in webVersionFiles" :key="webFile.id">
							<TableCell is-row-header>
								{{ getLocalizedName(webFile.name) }}
							</TableCell>
							<TableCell>
								<FieldSelectBorderless
									v-model="linkSelections[webFile.id]"
									:options="getHighResOptionsForWebFile(webFile.id)"
									:aria-label="
										t('publication.mediaFiles.selectHighResolutionFor', {
											fileName: getLocalizedName(webFile.name),
										})
									"
									size="large"
								/>
							</TableCell>
						</TableRow>
					</TableBody>
				</PkpTable>
			</div>
			<div class="border-t border-light">
				<div class="bg-secondary p-4">
					<ButtonRow>
						<PkpButton is-warnable @click="closeModal()">
							{{ t('common.cancel') }}
						</PkpButton>
						<PkpButton :disabled="!hasSelections" @click="handleLinkImages">
							{{ t('publication.mediaFiles.linkImages') }}
						</PkpButton>
					</ButtonRow>
				</div>
			</div>
		</div>
	</SideModalBody>
</template>

<script setup>
import {inject} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import {useMediaFileManagerBatchLinkImagesModal} from './useMediaFileManagerBatchLinkImagesModal';

import SideModalBody from '@/components/Modal/SideModalBody.vue';
import PkpTable from '@/components/Table/Table.vue';
import ButtonRow from '@/components/ButtonRow/ButtonRow.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableRow from '@/components/Table/TableRow.vue';
import TableCell from '@/components/Table/TableCell.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import PkpButton from '@/components/Button/Button.vue';
import Spinner from '@/components/Spinner/Spinner.vue';
import FieldSelectBorderless from '@/components/Form/fields/FieldSelectBorderless.vue';

const {t} = useLocalize();
const closeModal = inject('closeModal');

const {
	isLoadingMediaFiles,
	linkSelections,
	webVersionFiles,
	getHighResOptionsForWebFile,
	hasSelections,
	handleLinkImages,
	getLocalizedName,
} = useMediaFileManagerBatchLinkImagesModal();
</script>
