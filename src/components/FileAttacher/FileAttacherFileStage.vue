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
					:genreName="item.genre.name"
					:genreIsPrimary="!item.genre.dependent && !item.genre.supplementary"
					:fileId="item.id"
					:name="localize(item.name)"
					:url="item.url"
				>
					<input type="checkbox" :value="item.id" v-model="selected" />
				</select-submission-file-list-item>
			</template>
		</list-panel>
		<div class="fileAttacher__footer">
			<pkp-button
				class="fileAttacher__back"
				:is-link="true"
				@click="$emit('cancel')"
			>
				<icon icon="long-arrow-left" :inline="true" />
				{{ backLabel }}
			</pkp-button>
			<pkp-button
				:isDisabled="!selected.length"
				@click="$emit('selected:files', selectedFiles)"
			>
				{{ attachSelectedLabel }}
			</pkp-button>
		</div>
	</div>
</template>

<script>
import Dropdown from '@/components/Dropdown/Dropdown.vue';
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import PkpHeader from '@/components/Header/Header.vue';
import SelectSubmissionFileListItem from '../ListPanel/submissionFiles/SelectSubmissionFileListItem.vue';
import ajaxError from '@/mixins/ajaxError';

export default {
	name: 'FileAttacherFileStage',
	mixins: [ajaxError],
	components: {
		Dropdown,
		ListPanel,
		PkpHeader,
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
		fileStages: {
			type: Array,
			required: true
		},
		submissionFilesApiUrl: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			currentFileStage: {},
			isLoading: false,
			files: [],
			selected: []
		};
	},
	computed: {
		selectedFiles() {
			return this.files.filter(item => this.selected.includes(item.id));
		}
	},
	methods: {
		getFiles() {
			let self = this;
			this.isLoading = true;
			this.files = [];
			$.ajax({
				url: this.submissionFilesApiUrl,
				type: 'GET',
				data: this.currentFileStage.queryParams,
				success(r) {
					self.files = r.items;
				},
				error: this.ajaxErrorCallback,
				complete(r) {
					self.isLoading = false;
				}
			});
		}
	},
	watch: {
		currentFileStage(newVal, oldVal) {
			this.getFiles();
		}
	},
	created() {
		this.currentFileStage = this.fileStages[0];
	}
};
</script>

<style lang="less">
@import '../../styles/_import';
</style>
