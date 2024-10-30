<template>
	<div class="fileAttacherFileStage" aria-live="polite">
		<ListPanel :items="files" :is-loading="isLoading">
			<template #header>
				<PkpHeader>
					<h2>{{ currentFileStage.label }}</h2>
					<template #actions>
						<Dropdown v-if="fileStages.length > 1" label="Other Files">
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
						</Dropdown>
					</template>
				</PkpHeader>
			</template>
			<template #itemsEmpty>
				<div v-if="isLoading">
					<Spinner />
					{{ t('common.loading') }}
				</div>
			</template>
			<template #item="{item}">
				<SelectSubmissionFileListItem
					:document-type="item.documentType"
					:download-label="downloadLabel"
					:genre-name="localize(item.genreName)"
					:genre-is-primary="
						!item.genreIsDependent && !item.genreIsSupplementary
					"
					:file-id="item.id"
					:name="localize(item.name)"
					:url="item.url"
				>
					<input v-model="selected" type="checkbox" :value="item.id" />
				</SelectSubmissionFileListItem>
			</template>
		</ListPanel>
		<ButtonRow class="fileAttacher__footer">
			<template #end>
				<PkpButton :is-link="true" @click="$emit('cancel')">
					<Icon icon="ArrowLeft" class="h-4 w-4" :inline="true" />
					{{ backLabel }}
				</PkpButton>
			</template>
			<PkpButton
				:is-disabled="!selected.length"
				@click="$emit('selected:files', selectedFiles)"
			>
				{{ attachSelectedLabel }}
			</PkpButton>
		</ButtonRow>
	</div>
</template>

<script>
import ButtonRow from '@/components/ButtonRow/ButtonRow.vue';
import Dropdown from '@/components/Dropdown/Dropdown.vue';
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import PkpHeader from '@/components/Header/Header.vue';
import SelectSubmissionFileListItem from '../ListPanel/submissionFiles/SelectSubmissionFileListItem.vue';
import ajaxError from '@/mixins/ajaxError';
import Spinner from '@/components/Spinner/Spinner.vue';
import PkpButton from '@/components/Button/Button.vue';
import Icon from '@/components/Icon/Icon.vue';

export default {
	name: 'FileAttacherFileStage',
	components: {
		ButtonRow,
		Dropdown,
		ListPanel,
		PkpHeader,
		SelectSubmissionFileListItem,
		Spinner,
		PkpButton,
		Icon,
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
