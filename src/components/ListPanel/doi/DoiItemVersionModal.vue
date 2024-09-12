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
					:id="versionHeaderId"
					:href="version.urlPublished"
					target="_blank"
					rel="noopener noreferrer"
				>
					{{ getVersionHeader(version) }}
				</a>
				<PkpTable :labelled-by="versionHeaderId">
					<TableHeader>
						<TableColumn
							v-for="column in doiListColumns"
							:id="column.name"
							:key="column.name"
						>
							{{ column.label }}
						</TableColumn>
					</TableHeader>
					<TableBody>
						<TableRow
							v-for="row in item.doiObjects.filter(
								(doiObject) =>
									doiObject.versionNumber === version.versionNumber,
							)"
							:key="row.column"
						>
							<TableCell>
								<label :for="row.uid" :class="{labelDisabled: row.disabled}">
									{{ row.displayType }}
								</label>
							</TableCell>
							<TableCell>
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
						</TableRow>
					</TableBody>
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
import TableColumn from '@/components/Table/TableColumn.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableRow from '@/components/Table/TableRow.vue';
import Spinner from '@/components/Spinner/Spinner.vue';
import PkpButton from '@/components/Button/Button.vue';

import {useId} from '@/composables/useId.js';
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
const {generateId} = useId();
const versionHeaderId = generateId();

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
