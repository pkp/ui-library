<template>
	<div class="fileAttacherReviewFiles">
		<div v-if="!files.length" class="fileAttacherReviewFiles__noFiles">
			{{ t('common.noItemsFound') }}
		</div>
		<template v-else>
			<select-submission-file-list-item
				v-for="(file, i) in files"
				:key="i"
				:document-type="file.documentType"
				:download-label="downloadLabel"
				:genre-name="file.typeName"
				:file-id="file.id"
				:name="file.reviewerName + ' — ' + localize(file.name)"
				:url="file.url"
			>
				<input v-model="selected" type="checkbox" :value="file.id" />
			</select-submission-file-list-item>
		</template>
		<button-row class="fileAttacher__footer">
			<template #end>
				<pkp-button :is-link="true" @click="$emit('cancel')">
					<icon icon="long-arrow-left" :inline="true" />
					{{ backLabel }}
				</pkp-button>
			</template>
			<pkp-button
				:is-disabled="!selected.length"
				@click="$emit('selected:files', selectedFiles)"
			>
				{{ attachSelectedLabel }}
			</pkp-button>
		</button-row>
	</div>
</template>

<script>
import ButtonRow from '@/components/ButtonRow/ButtonRow.vue';
import SelectSubmissionFileListItem from '@/components/ListPanel/submissionFiles/SelectSubmissionFileListItem.vue';

export default {
	name: 'FileAttacherReviewFiles',
	components: {
		ButtonRow,
		SelectSubmissionFileListItem,
	},
	props: {
		attachSelectedLabel: {
			type: String,
			required: true,
		},
		backLabel: {
			type: String,
			required: true,
		},
		component: {
			type: String,
			required: true,
		},
		downloadLabel: {
			type: String,
			required: true,
		},
		files: {
			type: Array,
			required: true,
		},
	},
	data() {
		return {
			selected: [],
		};
	},
	computed: {
		selectedFiles() {
			return this.files.filter((file) => this.selected.includes(file.id));
		},
	},
};
</script>

<style lang="less">
@import '../../styles/_import';

.fileAttacherReviewFiles__noFiles {
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 4rem;
	font-size: @font-sml;
}

.fileAttacherReviewFiles .selectSubmissionFileListItem {
	padding: 0.75rem 0.5rem 0.75rem 0;
	margin-inline-start: -1rem;
}
</style>
