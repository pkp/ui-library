<template>
	<div>
		<PkpTable>
			<template #label>
				<h3 class="">
					{{ t('tasks.discussions.title') }}
				</h3>
			</template>
			<template #description>
				<p>
					{{ t('tasks.discussions.description') }}
				</p>
			</template>
			<template #top-controls>
				<div class="flex gap-x-2">
					<component
						:is="Components[action.component] || action.component"
						v-bind="action.props || {}"
						v-for="(action, i) in tasksAndDiscussionsStore.topItems"
						:key="i"
					></component>
				</div>
			</template>
			<TableHeader>
				<TableColumn
					v-for="(column, i) in tasksAndDiscussionsStore.columns"
					:key="i"
				>
					<span :class="column.headerSrOnly ? 'sr-only' : ''">
						{{ column.header }}
					</span>
				</TableColumn>
			</TableHeader>
			<TableBody>
				<template
					v-for="itemStatus in tasksAndDiscussionsStore.tasksAndDiscussions"
					:key="itemStatus.name"
				>
					<TableRow>
						<TableColGroup>
							<Icon
								:icon="itemStatus.icon"
								class="h-5 w-5"
								:class="
									itemStatus.name === 'Closed' ? 'text-success' : 'text-primary'
								"
							></Icon>
							<span class="ms-2">{{ itemStatus.name }}</span>
						</TableColGroup>
					</TableRow>
					<TableRow
						v-for="workItem in itemStatus.items"
						:key="workItem.id"
						:striped="false"
					>
						<component
							:is="Components[column.component] || column.component"
							v-for="(column, i) in tasksAndDiscussionsStore.columns"
							:key="i"
							:work-item="workItem"
						></component>
					</TableRow>
				</template>
			</TableBody>
		</PkpTable>
	</div>
</template>
<script setup>
import {useTasksAndDiscussionsManagerStore} from './tasksAndDiscussionsManagerStore';
import Icon from '@/components/Icon/Icon.vue';

import PkpTable from '@/components/Table/Table.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableColGroup from '@/components/Table/TableColGroup.vue';
import TableRow from '@/components/Table/TableRow.vue';

import TasksAndDiscussionsActionButton from './TasksAndDiscussionsActionButton.vue';
import TasksAndDiscussionsCellName from './TasksAndDiscussionsCellName.vue';
import TasksAndDiscussionsCellActivity from './TasksAndDiscussionsCellActivity.vue';
import TasksAndDiscussionsCellDueDate from './TasksAndDiscussionsCellDueDate.vue';
import TasksAndDiscussionsCellStarted from './TasksAndDiscussionsCellStarted.vue';
import TasksAndDiscussionsCellClosed from './TasksAndDiscussionsCellClosed.vue';
import TasksAndDiscussionsCellActions from './TasksAndDiscussionsCellActions.vue';

const Components = {
	TasksAndDiscussionsActionButton,
	TasksAndDiscussionsCellName,
	TasksAndDiscussionsCellActivity,
	TasksAndDiscussionsCellDueDate,
	TasksAndDiscussionsCellStarted,
	TasksAndDiscussionsCellClosed,
	TasksAndDiscussionsCellActions,
};

const props = defineProps({
	submission: {type: Object, required: true},
	tasksAndDiscussions: {type: Array, required: true},
});

const tasksAndDiscussionsStore = useTasksAndDiscussionsManagerStore(props);
</script>
