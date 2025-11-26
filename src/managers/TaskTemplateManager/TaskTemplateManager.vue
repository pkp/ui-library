<template>
	<div>
		<PkpTable>
			<template #label>
				<h3 class="text-xl-bold">
					{{ t('taskTemplates.title') }}
					<Spinner
						v-if="taskTemplateManagerStore.isLoadingTemplates"
						class="ms-2"
					/>
				</h3>
			</template>
			<template #description>
				<p class="text-lg-normal">
					{{ t('taskTemplates.description') }}
				</p>
			</template>
			<TableHeader>
				<TableColumn
					v-for="(column, i) in taskTemplateManagerStore.columns"
					:key="i"
					:no-text-wrap="false"
				>
					<span :class="column.headerSrOnly ? 'sr-only' : ''">
						{{ column.header }}
					</span>
				</TableColumn>
			</TableHeader>
			<TableBody>
				<template
					v-for="stage in taskTemplateManagerStore.stagedTemplates"
					:key="stage.key"
				>
					<TableRowGroupWrapper
						:empty-text="
							taskTemplateManagerStore.isLoadingTemplates
								? t('common.loading')
								: t('grid.noItems')
						"
					>
						<TableRow>
							<TableRowGroup>
								<span class="text-lg-bold">{{ stage.name }}</span>
								<template #action="{groupId}">
									<PkpButton
										:is-link="true"
										:aria-labelledby="groupId"
										@click="taskTemplateManagerStore.templateAdd({stage})"
									>
										{{ t('taskTemplates.add') }}
									</PkpButton>
								</template>
							</TableRowGroup>
						</TableRow>
						<TableRow
							v-for="template in stage.templates"
							:key="template.id"
							:striped="false"
						>
							<component
								:is="Components[column.component] || column.component"
								v-for="(column, i) in taskTemplateManagerStore.columns"
								:key="i"
								:index="i"
								:stage="stage"
								:task-template="template"
							></component>
						</TableRow>
					</TableRowGroupWrapper>
				</template>
			</TableBody>
		</PkpTable>
	</div>
</template>
<script setup>
import {useTaskTemplateManagerStore} from './taskTemplateManagerStore';

import PkpButton from '@/components/Button/Button.vue';
import PkpTable from '@/components/Table/Table.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableRowGroup from '@/components/Table/TableRowGroup.vue';
import TableRow from '@/components/Table/TableRow.vue';
import TableRowGroupWrapper from '@/components/Table/TableRowGroupWrapper.vue';
import TaskTemplateManagerCellName from './TaskTemplateManagerCellName.vue';
import TaskTemplateManagerCellAutoAdd from './TaskTemplateManagerCellAutoAdd.vue';
import TaskTemplateManagerCellActions from './TaskTemplateManagerCellActions.vue';
import Spinner from '@/components/Spinner/Spinner.vue';

const Components = {
	TaskTemplateManagerCellName,
	TaskTemplateManagerCellAutoAdd,
	TaskTemplateManagerCellActions,
};

const taskTemplateManagerStore = useTaskTemplateManagerStore();
</script>
