<template>
	<div class="fileAttacher">
		<action-panel
			v-for="(attacher, key) in attachers"
			:key="key"
			:id="'attacher' + key"
		>
			<h2>{{ attacher.label }}</h2>
			<p v-html="attacher.description" />
			<template slot="actions">
				<pkp-button
					:aria-describedby="'attacher' + key"
					@click="setAttacher(attacher)"
				>
					{{ attacher.button }}
				</pkp-button>
			</template>
		</action-panel>
		<modal
			:closeLabel="__('common.close')"
			name="attacher"
			:title="currentAttacher ? currentAttacher.label : ''"
			@closed="resetFocus"
		>
			<component
				v-if="currentAttacher"
				:is="currentAttacher.component"
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
		Modal
	},
	props: {
		attachers: {
			type: Array,
			required: true
		}
	},
	data() {
		return {
			currentAttacher: null,
			resetFocusTo: null
		};
	},
	methods: {
		attachFiles(files) {
			this.$emit('attached:files', this.currentAttacher.component, files);
			this.$modal.hide('attacher');
		},
		cancel() {
			this.$modal.hide('attacher');
			this.$nextTick(() => (this.currentAttacher = null));
		},
		resetFocus() {
			if (this.resetFocusTo) {
				this.resetFocusTo.focus();
			}
		},
		setAttacher(attacher) {
			this.currentAttacher = attacher;
			this.resetFocusTo = document.activeElement;
			this.$modal.show('attacher');
		}
	}
};
</script>

<style lang="less">
@import '../../styles/_import';

.fileAttacher .actionPanel:not(:last-child) {
	margin-bottom: 2rem;
}

.fileAttacher__footer {
	display: flex;
	padding-top: 1rem;

	.pkpButton + .pkpButton {
		margin-left: 0.25rem;
	}
}

.fileAttacher__back {
	margin-right: auto;
}
</style>
