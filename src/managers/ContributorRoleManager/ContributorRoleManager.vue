<template>
	<PkpTable>
		<template #label>{{ t('manager.contributorRoles.title') }}</template>
		<template #top-controls>
			<PkpButton @click="contributorRoleManagerStore.roleAdd">
				{{ t('manager.contributorRoles.add') }}
			</PkpButton>
		</template>
		<TableHeader>
			<TableColumn>
				<span>
					{{ t('manager.contributorRoles.name') }}
				</span>
			</TableColumn>
			<TableColumn>
				<span>
					{{ t('manager.contributorRoles.identifier') }}
				</span>
			</TableColumn>
			<TableColumn>
				<span class="sr-only">{{ t('common.moreActions') }}</span>
			</TableColumn>
		</TableHeader>

		<TableBody>
			<TableRow
				v-for="role in contributorRoleManagerStore.roles"
				:key="role.id"
			>
				<TableCell :is-row-header="true">
					<span>
						{{ localize(role.name) }}
					</span>
				</TableCell>
				<TableCell>
					<span>
						{{ role.contributorRoleIdentifier }}
					</span>
				</TableCell>
				<TableCell>
					<DropdownActions
						:label="t('common.moreActions')"
						button-variant="ellipsis"
						:actions="contributorRoleManagerStore.getItemActions()"
						@action="
							(actionName) => contributorRoleManagerStore[actionName](role)
						"
					/>
				</TableCell>
			</TableRow>
		</TableBody>
	</PkpTable>
</template>

<script setup>
import PkpTable from '@/components/Table/Table.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableRow from '@/components/Table/TableRow.vue';
import TableCell from '@/components/Table/TableCell.vue';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';
import PkpButton from '@/components/Button/Button.vue';
import {localize} from '@/utils/i18n.js';
import {useContributorRoleManagerStore} from '@/managers/ContributorRoleManager/contributorRoleManagerStore.js';

const props = defineProps({});

const contributorRoleManagerStore = useContributorRoleManagerStore(props);
</script>
