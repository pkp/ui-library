<template>
	<SideModalBody>
		<template #title>
			{{ t('doi.manager.versions.modalTitle') }}
		</template>
		<SideModalLayoutBasic>
			<div
				v-for="version in item.versions"
				:key="version.id"
				class="doiListItem__versionContainer"
			>
				<a
					:href="version.urlPublished"
					target="_blank"
					rel="noopener noreferrer"
				>
					{{ getVersionHeader(version) }}
				</a>
				<PkpTable
					:columns="doiListColumns"
					:rows="
						item.doiObjects.filter(
							(doiObject) => doiObject.versionNumber === version.versionNumber,
						)
					"
				>
					<template #default="{row}">
						<TableCell :column="doiListColumns[0]" :row="row">
							<label
								:for="row.uid"
								v-bind:class="{labelDisabled: row.disabled}"
							>
								{{ row.displayType }}
							</label>
						</TableCell>
						<TableCell :column="doiListColumns[1]" :row="row">
							<input
								:id="row.uid"
								v-model="
									mutableDois.find((doi) => doi.uid === row.uid).identifier
								"
								class="pkpFormField__input pkpFormField--text__input"
								type="text"
								:readonly="!(isEditingDois && !isSaving)"
								:disabled="isEditingDois && row.disabled"
							/>
						</TableCell>
					</template>
				</PkpTable>
				<span v-if="item.hasDisabled">
					{{ item.hasDisabledMsg }}
				</span>
			</div>

			<div class="doiListItem__versionContainer--actionsBar">
				<Spinner v-if="isSaving" />
				<PkpButton
					:is-disabled="isDeposited || isSaving"
					@click="
						(...args) =>
							isEditingDois
								? emit('saveDois', ...args)
								: emit('editDois', ...args)
					"
				>
					{{ isEditingDois ? t('common.save') : t('common.edit') }}
				</PkpButton>
			</div>
		</SideModalLayoutBasic>
	</SideModalBody>
</template>

<script setup>
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import PkpTable from '@/components/Table/Table.vue';
import TableCell from '@/components/Table/TableCell.vue';
import Spinner from '@/components/Spinner/Spinner.vue';
import PkpButton from '@/components/Button/Button.vue';

import {useLocalize} from '@/composables/useLocalize';
defineProps({
	isSaving: {type: Boolean, required: false, default: false},
	isDeposited: {type: Boolean, required: false, default: false},
	item: {type: Object, required: true},
	doiListColumns: {type: Array, required: true},
	isEditingDois: {type: Boolean, required: true},
	mutableDois: {type: Array, required: true},
});
const {t} = useLocalize();

const emit = defineEmits(['saveDois', 'editDois']);
/**
 * @param {PublicationVersionInfo} version
 */
function getVersionHeader(version) {
	const dateInfo =
		version.datePublished !== null
			? `(${version.datePublished})`
			: t('publication.status.unpublished');
	return `${t('publication.version', {
		version: version.versionNumber,
	})} ${dateInfo}`;
}
</script>

<style lang="less">
@import '../../../styles/_import';

.doiListItem__versionContainer {
	margin-top: 0.5rem;
}

.doiListItem__versionContainer--actionsBar {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	margin-top: 0.5rem;
}

.labelDisabled {
	color: #4e4f4f;
}
</style>
