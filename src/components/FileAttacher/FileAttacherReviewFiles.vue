<template>
	<div class="fileAttacherReviewFiles">
		<div v-if="!files.length" class="fileAttacherReviewFiles__noFiles">
			{{ __('common.noItemsFound') }}
		</div>
		<div v-else>
			<select-submission-file-list-item
				v-for="(file, i) in files"
				:key="i"
				:documentType="file.documentType"
				:downloadLabel="downloadLabel"
				:genreName="file.typeName"
				:fileId="file.id"
				:name="file.reviewerName + ' — ' + localize(file.name)"
				:url="file.url"
			>
				<input type="checkbox" :value="file.id" v-model="selected" />
			</select-submission-file-list-item>
		</div>
		<div class="fileAttacher__footer">
			<button class="fileAttacher__back -linkButton" @click="$emit('cancel')">
				<icon icon="long-arrow-left" :inline="true" />
				{{ backLabel }}
			</button>
			<pkp-button
				:isPrimary="true"
				:isDisabled="!selected.length"
				@click="$emit('selected:files', selectedFiles)"
			>
				{{ attachSelectedLabel }}
			</pkp-button>
		</div>
	</div>
</template>

<script>
import SelectSubmissionFileListItem from '@/components/ListPanel/submissionFiles/SelectSubmissionFileListItem.vue';

export default {
	name: 'FileAttacherReviewFiles',
	components: {
		SelectSubmissionFileListItem
	},
	props: {
		attachSelectedLabel: {
			type: String,
			required: true
		},
		backLabel: {
			type: String,
			required: true
		},
		component: {
			type: String,
			required: true
		},
		downloadLabel: {
			type: String,
			required: true
		},
		files: {
			type: Array,
			required: true
		}
	},
	data() {
		return {
			selected: []
		};
	},
	computed: {
		selectedFiles() {
			return this.files.filter(file => this.selected.includes(file.id));
		}
	}
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
</style>
