<template>
	<div class="fileAttacher">
		<action-panel
			v-for="(attacher, key) in attachers"
			:id="'attacher' + key"
			:key="key"
		>
			<h2>{{ attacher.label }}</h2>
			<p v-html="attacher.description" />
			<template #actions>
				<pkp-button
					:aria-describedby="'attacher' + key"
					@click="setAttacher(attacher)"
				>
					{{ attacher.button }}
				</pkp-button>
			</template>
		</action-panel>
		<modal
			:close-label="t('common.close')"
			name="attacher"
			:title="currentAttacher ? currentAttacher.label : ''"
			:open="isModalOpenedAttacher"
			@close="isModalOpenedAttacher = false"
		>
			<component
				:is="currentAttacher.component"
				v-if="currentAttacher"
				v-bind="currentAttacher"
				@selected:files="attachFiles"
				@cancel="cancel"
			/>
		</modal>
	</div>
</template>

<script>
import ActionPanel from '../ActionPanel/ActionPanel.vue';
import FileAttacherFileStage from './FileAttacherFileStage.vue';
import FileAttacherLibrary from './FileAttacherLibrary.vue';
import FileAttacherReviewFiles from './FileAttacherReviewFiles.vue';
import FileAttacherUpload from './FileAttacherUpload.vue';
import Modal from '../Modal/Modal.vue';

export default {
	name: 'FileAttacher',
	components: {
		ActionPanel,
		FileAttacherFileStage,
		FileAttacherLibrary,
		FileAttacherReviewFiles,
		FileAttacherUpload,
		Modal,
	},
	props: {
		/** An array of file attachers. See guidance in storybook.  */
		attachers: {
			type: Array,
			required: true,
		},
	},
	emits: [
		/** Emitted when one or more files are attached using one of the `attachers`. Payload: `(attacher, files)` */
		'attached:files',
	],
	data() {
		return {
			currentAttacher: null,
			resetFocusTo: null,
			isModalOpenedAttacher: false,
		};
	},
	methods: {
		/**
		 * Emit an event to attach files and close the current attacher
		 */
		attachFiles(files) {
			this.$emit('attached:files', this.currentAttacher.component, files);
			this.isModalOpenedAttacher = false;
		},

		/**
		 * Close the current attacher
		 */
		cancel() {
			this.isModalOpenedAttacher = false;
			this.$nextTick(() => (this.currentAttacher = null));
		},

		/**
		 * Set the current attacher and open the modal
		 *
		 * @param {Object} attacher Props for one of the `FileAttacher****` components
		 */
		setAttacher(attacher) {
			this.currentAttacher = attacher;
			this.isModalOpenedAttacher = true;
		},
	},
};
</script>

<style lang="less">
@import '../../styles/_import';

.fileAttacher .actionPanel:not(:last-child) {
	margin-bottom: 2rem;
}

.fileAttacher__footer {
	padding-top: 1rem;

	.pkpButton + .pkpButton {
		margin-inline-start: 0.25rem;
	}
}

.fileAttacher__back {
	margin-inline-end: auto;
}
</style>
