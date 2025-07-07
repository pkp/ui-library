<template>
	<div>
		<PkpTable>
			<template #label>
				<h3 class="">
					{{ t('discussion.title') }}
				</h3>
			</template>
			<template #description>
				<p>
					{{ t('discussion.description') }}
				</p>
			</template>
			<template #top-controls>
				<div class="flex gap-x-2">
					<component
						:is="Components[action.component] || action.component"
						v-bind="action.props || {}"
						v-for="(action, i) in discussionManagerStore.topItems"
						:key="i"
					></component>
				</div>
			</template>
			<TableHeader>
				<TableColumn
					v-for="(column, i) in discussionManagerStore.columns"
					:key="i"
				>
					<span :class="column.headerSrOnly ? 'sr-only' : ''">
						{{ column.header }}
					</span>
				</TableColumn>
			</TableHeader>
			<TableBody>
				<template
					v-for="itemStatus in discussionManagerStore.discussions"
					:key="itemStatus.name"
				>
					<TableRowGroup>
						<TableRow>
							<TableColGroup>
								<Icon
									:icon="itemStatus.icon"
									class="h-5 w-5"
									:class="
										itemStatus.name === 'Closed'
											? 'text-success'
											: 'text-primary'
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
								v-for="(column, i) in discussionManagerStore.columns"
								:key="i"
								:work-item="workItem"
							></component>
						</TableRow>
					</TableRowGroup>
				</template>
			</TableBody>
		</PkpTable>
	</div>
</template>
<script setup>
import {useDiscussionManagerStore} from './discussionManagerStore';
import Icon from '@/components/Icon/Icon.vue';

import PkpTable from '@/components/Table/Table.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableColGroup from '@/components/Table/TableColGroup.vue';
import TableRow from '@/components/Table/TableRow.vue';
import TableRowGroup from '@/components/Table/TableRowGroup.vue';

import DiscussionManagerActionButton from './DiscussionManagerActionButton.vue';
import DiscussionManagerCellName from './DiscussionManagerCellName.vue';
import DiscussionManagerCellActivity from './DiscussionManagerCellActivity.vue';
import DiscussionManagerCellDueDate from './DiscussionManagerCellDueDate.vue';
import DiscussionManagerCellStarted from './DiscussionManagerCellStarted.vue';
import DiscussionManagerCellClosed from './DiscussionManagerCellClosed.vue';
import DiscussionManagerCellActions from './DiscussionManagerCellActions.vue';

const Components = {
	DiscussionManagerActionButton,
	DiscussionManagerCellName,
	DiscussionManagerCellActivity,
	DiscussionManagerCellDueDate,
	DiscussionManagerCellStarted,
	DiscussionManagerCellClosed,
	DiscussionManagerCellActions,
};

const props = defineProps({
	submission: {type: Object, required: true},
	submissionStageId: {type: Number, required: true},
	discussions: {type: Array, required: true},
});

const discussionManagerStore = useDiscussionManagerStore(props);
</script>
