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
							<TableCell>
								<Badge
									v-if="row.isCurrentVersion && row.type === 'publication'"
									class="doiListItem__itemMetadata--badge"
									:is-warnable="
										(item.isPublished &&
											!isDeposited[row.id] &&
											isRegistrationPluginConfigured) ||
										(isDeposited[row.id] &&
											isRegistrationPluginConfigured &&
											isStale(row.itemDepositStatus)) ||
										hasErrors[row.id]
									"
									:is-primary="item.isPublished && isDeposited[row.id]"
								>
									{{
										!item.isPublished
											? publicationStatusLabel
											: depositStatusString
									}}
								</Badge>

								<Badge
									v-else
									class="doiListItem__itemMetadata--badge"
									:is-warnable="
										(!isDeposited[row.id] && isRegistrationPluginConfigured) ||
										(isDeposited[row.id] &&
											isRegistrationPluginConfigured &&
											isStale(row.itemDepositStatus)) ||
										hasErrors[row.id]
									"
									:is-primary="item.isPublished && isDeposited[row.id]"
								>
									{{ getDepositStatusString(row.depositStatus, !!row.doiId) }}
								</Badge>
							</TableCell>

							<TableCell>
								<PkpButton
									v-if="hasErrors[row.id]"
									is-link
									@click="emit('openViewErrorModal', row.errorMessage)"
								>
									{{ t('common.viewError') }}
								</PkpButton>
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
import {computed, useId} from 'vue';

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
import Badge from '@/components/Badge/Badge.vue';

import {useLocalize} from '@/composables/useLocalize';
const props = defineProps({
	isSaving: {type: Boolean, required: false, default: false},
	/** @type {DoiListItemData} */
	item: {type: Object, required: true},
	doiListColumns: {type: Array, required: true},
	isEditingDois: {type: Boolean, required: true},
	mutableDois: {type: Array, required: true},
	isRegistrationPluginConfigured: {type: Boolean, require: true},
	publicationStatusLabel: {type: String, required: true},
	depositStatusString: {type: String, required: true},
	itemDepositStatus: {type: String, required: true},
});
const {t} = useLocalize();
const versionHeaderId = useId();

const emit = defineEmits(['saveDois', 'editDois', 'openViewErrorModal']);
/**
 * @param {PublicationVersionInfo} version
 */
function getVersionHeader(version) {
	const dateInfo =
		version.datePublished !== null
			? `(${version.datePublished})`
			: t('publication.status.unpublished');
	return `${version.versionNumber} ${dateInfo}`;
}

function isStale(status) {
	return status === pkp.const.DOI_STATUS_STALE;
}

function getDepositStatusString(itemDepositStatus, hasDoi) {
	switch (itemDepositStatus) {
		case pkp.const.DOI_STATUS_UNREGISTERED:
			return !hasDoi
				? this.t('manager.dois.status.needsDoi')
				: this.t('manager.dois.status.unregistered');
		case pkp.const.DOI_STATUS_SUBMITTED:
			return this.t('manager.dois.status.submitted');
		case pkp.const.DOI_STATUS_REGISTERED:
			return this.t('manager.dois.status.registered');
		case pkp.const.DOI_STATUS_ERROR:
			return this.t('manager.dois.status.error');
		case pkp.const.DOI_STATUS_STALE:
			return this.t('manager.dois.status.stale');
		default:
			return '';
	}
}

const hasErrors = computed(() => {
	const results = {
		[props.item.id]: props.itemDepositStatus === pkp.const.DOI_STATUS_ERROR,
	};

	props.item.doiObjects.forEach((doiObject) => {
		results[doiObject.id] =
			doiObject.depositStatus === pkp.const.DOI_STATUS_ERROR;
	});
	return results;
});

/**
 * Object containing key-value pairing indication if DOIs (doi of top level object and sub items) are deposited.
 * Key is the object's id, value is boolean indicating if deposited.
 *
 * @return {Object}
 */
const isDeposited = computed(() => {
	const depositedStatuses = [
		pkp.const.DOI_STATUS_SUBMITTED,
		pkp.const.DOI_STATUS_REGISTERED,
	];

	const results = {
		[props.item.id]: depositedStatuses.includes(props.itemDepositStatus),
	};

	props.item.doiObjects.forEach((doiObject) => {
		results[doiObject.id] = depositedStatuses.includes(doiObject.depositStatus);
	});

	return results;
});
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
