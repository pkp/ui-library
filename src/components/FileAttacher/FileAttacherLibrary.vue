<template>
	<div class="fileAttacherLibrary" aria-live="polite">
		<div v-if="!files.length" class="fileAttacherLibrary__message">
			<div v-if="isLoading">
				<spinner />
				{{ t('common.loading') }}
			</div>
			<div v-else>
				{{ t('common.noItemsFound') }}
			</div>
		</div>
		<div v-else>
			<select-submission-file-list-item
				v-for="(file, i) in files"
				:key="i"
				:document-type="file.documentType"
				:download-label="downloadLabel"
				:genre-name="file.typeName"
				:file-id="file.id"
				:name="localize(file.name)"
				:url="file.url"
			>
				<input v-model="selected" type="checkbox" :value="file.id" />
			</select-submission-file-list-item>
		</div>
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
import ajaxError from '@/mixins/ajaxError';

export default {
	name: 'FileAttacherLibrary',
	components: {
		ButtonRow,
		SelectSubmissionFileListItem,
	},
	mixins: [ajaxError],
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
		includeSubmissionId: {
			type: Number,
			default() {
				return -1;
			},
		},
		libraryApiUrl: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			isLoading: false,
			files: [],
			selected: [],
		};
	},
	computed: {
		selectedFiles() {
			return this.files.filter((file) => this.selected.includes(file.id));
		},
	},
	created() {
		this.getFiles();
	},
	methods: {
		getFiles() {
			this.isLoading = true;
			this.files = [];
			$.ajax({
				url: this.libraryApiUrl,
				type: 'GET',
				context: this,
				data: this.includeSubmissionId
					? {includeSubmissionId: this.includeSubmissionId}
					: {},
				success(r) {
					this.files = r.items;
				},
				error: this.ajaxErrorCallback,
				complete(r) {
					this.isLoading = false;
				},
			});
		},
	},
};
</script>

<style lang="less">
@import '../../styles/_import';

.fileAttacherLibrary__message {
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 4rem;
	font-size: @font-sml;
}

.fileAttacherLibrary .selectSubmissionFileListItem {
	padding: 0.75rem 0.5rem 0.75rem 0;
	margin-inline-start: -1rem;
}
</style>
