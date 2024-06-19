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
import AttacherModal from './AttacherModal.vue';
import {useModal} from '@/composables/useModal';

export default {
	name: 'FileAttacher',
	components: {
		ActionPanel,
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
		};
	},
	methods: {
		/**
		 * Emit an event to attach files and close the current attacher
		 */
		attachFiles(files) {
			this.$emit('attached:files', this.currentAttacher.component, files);
			const {closeSideModal} = useModal();
			closeSideModal(AttacherModal);
		},

		/**
		 * Close the current attacher
		 */
		cancel() {
			const {closeSideModal} = useModal();
			closeSideModal(AttacherModal);

			this.$nextTick(() => (this.currentAttacher = null));
		},

		/**
		 * Set the current attacher and open the modal
		 *
		 * @param {Object} attacher Props for one of the `FileAttacher****` components
		 */
		setAttacher(attacher) {
			this.currentAttacher = attacher;
			const {openSideModal} = useModal();
			openSideModal(AttacherModal, {
				title: this.currentAttacher ? this.currentAttacher.label : '',
				currentAttacher: this.currentAttacher,
				onAttachFiles: this.attachFiles,
				onCancel: this.cancel,
			});
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
