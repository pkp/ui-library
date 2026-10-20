<template>
	<SideModalBody>
		<template #title>
			<template v-if="isAuthor">
				{{ t('submission.reviewRound.submitYourResponse') }}
			</template>
			<template v-else>
				{{ t('submission.reviewRound.authorResponseToReviews') }}
			</template>
		</template>
		<template #description>
			<span v-if="isAuthor" class="text-lg-medium">
				{{ t('submission.reviewRound.authorResponse.authorCannotEdit') }}
			</span>
			<span v-else class="text-lg-medium">
				{{ t('submission.reviewRound.authorResponse.noteForEditor') }}
			</span>
		</template>
		<SideModalLayoutBasic>
			<PkpForm
				v-bind="form"
				field-heading-element="h2"
				:display-only="true"
				@set="set"
			/>
			<div v-if="isEditor" class="mt-6 border-t border-light pt-4">
				<ButtonRow>
					<PkpButton :is-warnable="true" @click="closeModal">
						{{ t('common.cancel') }}
					</PkpButton>
					<PkpButton @click="modifyResponse">
						{{ t('submission.reviewRound.authorResponse.modify') }}
					</PkpButton>
					<PkpButton :is-primary="true" @click="markAsComplete">
						{{ t('editor.review.markAsComplete') }}
					</PkpButton>
				</ButtonRow>
			</div>
		</SideModalLayoutBasic>
	</SideModalBody>
</template>

<script setup>
import {inject} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import {useAuthorResponseView} from './useAuthorResponseView';

import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import PkpForm from '@/components/Form/Form.vue';
import ButtonRow from '@/components/ButtonRow/ButtonRow.vue';
import PkpButton from '@/components/Button/Button.vue';

const props = defineProps({
	reviewRound: {type: Object, required: true},
	submission: {type: Object, required: true},
	stageId: {type: Number, required: true},
	authorOptions: {type: Array, required: true},
});

const closeModal = inject('closeModal');
const {t} = useLocalize();

const {form, set, isAuthor, isEditor, modifyResponse, markAsComplete} =
	useAuthorResponseView(props);
</script>
