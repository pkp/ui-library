<template>
	<div class="fileAttacherLibrary" aria-live="polite">
		<div v-if="!files.length" class="fileAttacherLibrary__message">
			<div v-if="isLoading">
				<spinner />
				{{ __('common.loading') }}
			</div>
			<div v-else>
				{{ __('common.noItemsFound') }}
			</div>
		</div>
		<div v-else class="fileAttacherLibrary__files">
			<div
				v-for="(file, i) in files"
				:key="i"
				class="fileAttacherUploader__file"
			>
				<label class="fileAttacherUploader__file__label">
					<input type="checkbox" :value="file.id" v-model="selected" />
					<file
						:id="'FileAttacherLibrary__File__' + i"
						:name="localize(file.name)"
						:documentType="file.documentType"
					/>
				</label>
				<div class="fileAttacherUploader__actions">
					<badge>
						{{ file.typeName }}
					</badge>
					<pkp-button
						class="fileAttacherLibrary__download"
						element="a"
						:href="file.url"
						target="_blank"
						rel="noopener noreferrer"
						:aria-describedby="'FileAttacherLibrary__File__' + i"
					>
						<icon icon="download" />
						<span class="-screenReader">{{ downloadLabel }}</span>
					</pkp-button>
				</div>
			</div>
		</div>
		<div class="fileAttacher__footer">
			<button class="fileAttacher__back -linkButton" @click="$emit('cancel')">
				<icon icon="long-arrow-left" :inline="true" />
				Back
			</button>
			<pkp-button
				:isDisabled="!selected.length"
				@click="$emit('selected:files', selectedFiles)"
			>
				Attach Selected
			</pkp-button>
		</div>
	</div>
</template>

<script>
import File from '@/components/File/File.vue';
import ajaxError from '@/mixins/ajaxError';

export default {
	name: 'FileAttacherLibrary',
	mixins: [ajaxError],
	components: {
		File
	},
	props: {
		component: {
			type: String,
			required: true
		},
		downloadLabel: {
			type: String,
			required: true
		},
		includeSubmissionId: {
			type: Number,
			default() {
				return -1;
			}
		},
		libraryApiUrl: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			isLoading: false,
			files: [],
			selected: []
		};
	},
	computed: {
		selectedFiles() {
			return this.files.filter(file => this.selected.includes(file.id));
		}
	},
	methods: {
		getFiles() {
			let self = this;
			this.isLoading = true;
			this.files = [];
			$.ajax({
				url: this.libraryApiUrl,
				type: 'GET',
				data: this.includeSubmissionId
					? {includeSubmissionId: this.includeSubmissionId}
					: {},
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
		selected(newVal, oldVal) {
			this.$emit('selected', newVal);
		}
	},
	created() {
		this.getFiles();
	}
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

.fileAttacherUploader__file {
	display: flex;
	align-items: center;
	margin: 0.5rem 0;
}

.fileAttacherUploader__file__label {
	display: flex;
	align-items: center;
	overflow: hidden;

	.file {
		margin-left: 1rem;
	}
}

.fileAttacherUploader__actions {
	display: flex;
	align-items: center;
	margin-left: auto;
}

.fileAttacherLibrary__download {
	margin-left: 0.5rem;
	text-align: center;
}
</style>
