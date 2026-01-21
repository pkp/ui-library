<template>
	<PkpTable>
		<template #label>
			<h3 class="">
				{{ t('submission.reviewRound.authorResponse') }}
			</h3>
		</template>
		<template #description>
			<p>
				{{
					t('editor.submission.reviewRound.RequestAuthorResponse.description')
				}}
			</p>
		</template>
		<template #top-controls>
			<div class="flex gap-x-2">
				<component
					:is="Components[action.component] || action.component"
					v-bind="action.props || {}"
					v-for="(action, i) in store.topItems"
					:key="i"
				></component>
			</div>
		</template>
		<TableHeader>
			<TableColumn v-for="(column, i) in store.columns" :key="i">
				<span :class="column.headerSrOnly ? 'sr-only' : ''">
					{{ column.header }}
				</span>
			</TableColumn>
		</TableHeader>
		<TableBody>
			<TableRow v-for="author in store.authors" :key="author.id">
				<component
					:is="Components[column.component] || column.component"
					v-for="(column, i) in store.columns"
					:key="i"
					:author="author"
					:review-round="reviewRound"
					:can-request-response="store.canRequestReviewRoundAuthorResponse"
					v-bind="column.props"
				></component>
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
import {useReviewRoundAuthorResponseRequestStore} from './AuthorResponseRequestManagerStore';
import AuthorResponseRequestManagerCellAuthor from './AuthorResponseRequestManagerCellAuthor.vue';
import AuthorResponseRequestManagerCellStatus from './AuthorResponseRequestManagerCellStatus.vue';
import AuthorResponseRequestManagerActionButton from './AuthorResponseRequestManagerActionButton.vue';
import AuthorResponseRequestManagerCellMoreActions from './AuthorResponseRequestManagerCellMoreActions.vue';

const Components = {
	AuthorResponseRequestManagerCellAuthor,
	AuthorResponseRequestManagerCellStatus,
	AuthorResponseRequestManagerActionButton,
	AuthorResponseRequestManagerCellMoreActions,
};

const props = defineProps({
	submission: {type: Object, required: true},
	reviewRound: {type: Object, required: true},
	publication: {type: Object, required: true},
	reviewRoundId: {type: Number, required: false, default: null},
	contextMinReviewsPerSubmission: {type: Number, required: true},
	stageId: {type: Number, required: true},
});

const store = useReviewRoundAuthorResponseRequestStore(props);
</script>
