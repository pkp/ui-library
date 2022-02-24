<template>
	<div class="fileAttacher">
		<panel v-if="!currentAttacher">
			<panel-section v-for="(attacher, key) in attachers" :key="key">
				<template slot="header">
					<h2>{{ attacher.label }}</h2>
					<p v-html="attacher.description" />
				</template>
				<pkp-button @click="setAttacher(attacher.component)">
					{{ attacher.button }}
				</pkp-button>
			</panel-section>
		</panel>
		<component
			v-else
			:is="currentAttacher.component"
			v-bind="currentAttacher"
			ref="attacher"
			@selected:files="attachFiles"
			@cancel="cancel"
		/>
	</div>
</template>

<script>
import FileAttacherFileStage from './FileAttacherFileStage.vue';
import FileAttacherLibrary from './FileAttacherLibrary.vue';
import FileAttacherReviewFiles from './FileAttacherReviewFiles.vue';
import FileAttacherUpload from './FileAttacherUpload.vue';

export default {
	name: 'FileAttacher',
	components: {
		FileAttacherFileStage,
		FileAttacherLibrary,
		FileAttacherReviewFiles,
		FileAttacherUpload
	},
	props: {
		attachers: {
			type: Array,
			required: true
		}
	},
	data() {
		return {
			currentAttacher: null
		};
	},
	methods: {
		attachFiles(files) {
			this.$emit('attached:files', this.currentAttacher.component, files);
		},
		cancel() {
			this.currentAttacher = null;
		},
		setAttacher(component) {
			this.currentAttacher = this.attachers.find(
				attacher => attacher.component === component
			);
			this.setFocusToRef('attacher');
		}
	}
};
</script>

<style lang="less">
@import '../../styles/_import';

.fileAttacher__footer {
	display: flex;
	padding-top: 1rem;
}
</style>
