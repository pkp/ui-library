<template>
	<div class="fileAttacherLibrary" aria-live="polite">
		<div v-if="!files.length" class="fileAttacherLibrary__message">
			<div v-if="isLoading">
				<Spinner />
				{{ t('common.loading') }}
			</div>
			<div v-else>
				{{ t('common.noItemsFound') }}
			</div>
		</div>
		<div v-else>
			<SelectSubmissionFileListItem
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
			</SelectSubmissionFileListItem>
		</div>
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
import SelectSubmissionFileListItem from '@/components/ListPanel/submissionFiles/SelectSubmissionFileListItem.vue';
import ajaxError from '@/mixins/ajaxError';
import Spinner from '@/components/Spinner/Spinner.vue';
import PkpButton from '@/components/Button/Button.vue';
import Icon from '@/components/Icon/Icon.vue';

export default {
	name: 'FileAttacherLibrary',
	components: {
		ButtonRow,
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
