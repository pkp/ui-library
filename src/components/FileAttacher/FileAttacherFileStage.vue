<template>
	<div class="fileAttacherFileStage" aria-live="polite">
		<list-panel :items="files" :isLoading="isLoading">
			<pkp-header slot="header">
				<h2>{{ currentFileStage.label }}</h2>
				<template slot="actions">
					<dropdown v-if="fileStages.length > 1" label="Other Files">
						<ul>
							<li v-for="fileStage in fileStages" :key="fileStage.label">
								<button
									class="pkpDropdown__action"
									@click="currentFileStage = fileStage"
								>
									{{ fileStage.label }}
								</button>
							</li>
						</ul>
					</dropdown>
				</template>
			</pkp-header>
			<div v-if="isLoading" slot="itemsEmpty">
				<spinner />
				{{ __('common.loading') }}
			</div>
			<template v-slot:item="{item}">
				<select-submission-file-list-item
					:documentType="item.documentType"
					:downloadLabel="downloadLabel"
					:genreName="localize(item.genreName)"
					:genreIsPrimary="!item.genreIsDependent && !item.genreIsSupplementary"
					:fileId="item.id"
					:name="localize(item.name)"
					:url="item.url"
				>
					<input type="checkbox" :value="item.id" v-model="selected" />
				</select-submission-file-list-item>
			</template>
		</list-panel>
		<button-row class="fileAttacher__footer">
			<template slot="end">
				<pkp-button :is-link="true" @click="$emit('cancel')">
					<icon icon="long-arrow-left" :inline="true" />
					{{ backLabel }}
				</pkp-button>
			</template>
			<pkp-button
				:isDisabled="!selected.length"
				@click="$emit('selected:files', selectedFiles)"
			>
				{{ attachSelectedLabel }}
			</pkp-button>
		</button-row>
	</div>
</template>

<script>
import ButtonRow from '@/components/ButtonRow/ButtonRow.vue';
import Dropdown from '@/components/Dropdown/Dropdown.vue';
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import PkpHeader from '@/components/Header/Header.vue';
import SelectSubmissionFileListItem from '../ListPanel/submissionFiles/SelectSubmissionFileListItem.vue';
import ajaxError from '@/mixins/ajaxError';

export default {
	name: 'FileAttacherFileStage',
	mixins: [ajaxError],
	components: {
		ButtonRow,
		Dropdown,
		ListPanel,
		PkpHeader,
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
		fileStages: {
			type: Array,
			required: true,
		},
		submissionFilesApiUrl: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			currentFileStage: {},
			isLoading: false,
			files: [],
			selected: [],
		};
	},
	computed: {
		selectedFiles() {
			return this.files.filter((item) => this.selected.includes(item.id));
		},
	},
	methods: {
		getFiles() {
			this.isLoading = true;
			this.files = [];
			$.ajax({
				url: this.submissionFilesApiUrl,
				type: 'GET',
				context: this,
				data: this.currentFileStage.queryParams,
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
	watch: {
		/**
		 * Update the files when a new file stage is selected
		 */
		currentFileStage(newVal, oldVal) {
			this.getFiles();
		},
	},
	created() {
		this.currentFileStage = this.fileStages[0];
	},
};
</script>

<style lang="less">
@import '../../styles/_import';

.fileAttacherFileStage {
	.selectSubmissionFileListItem__label {
		margin-inline-start: -1.5rem;
	}
}
</style>
