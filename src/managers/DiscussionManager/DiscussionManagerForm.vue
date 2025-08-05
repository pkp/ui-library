<template>
	<SideModalBody>
		<template #title>
			{{ hasContent ? localize(workItem.title) : t('discussion.title') }}
		</template>
		<template v-if="!hasContent" #description>
			<span class="text-lg-medium">
				{{ t('discussion.form.description') }}
			</span>
		</template>
		<template #post-description>
			<Badge v-bind="badgeProps" class="mt-1">
				{{ badgeProps.slot }}
			</Badge>
		</template>
		<template v-if="inDisplayModeRef" #actions>
			<PkpButton @click="editForm">{{ t('common.edit') }}</PkpButton>
		</template>

		<SideModalLayoutBasic>
			<FormDisplay
				v-if="inDisplayModeRef"
				v-bind="form"
				field-heading-element="h2"
			/>
			<PkpForm v-else v-bind="form" @cancel="onClose" @set="set" />
		</SideModalLayoutBasic>
	</SideModalBody>
</template>

<script setup>
import {ref, computed} from 'vue';
import {t} from '@/utils/i18n';
import {useDiscussionManagerForm} from './useDiscussionManagerForm';
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import Badge from '@/components/Badge/Badge.vue';
import PkpForm from '@/components/Form/Form.vue';
import FormDisplay from '@/components/FormDisplay/FormDisplay.vue';
import PkpButton from '@/components/Button/Button.vue';

const props = defineProps({
	status: {
		type: String,
		default: () => 'New',
	},
	submission: {
		type: Object,
		required: true,
	},
	submissionStageId: {
		type: Number,
		required: true,
	},
	workItem: {
		type: Object,
		default: () => null,
	},
	onCloseFn: {
		type: Function,
		default: () => () => {},
	},
	onSubmitFn: {
		type: Function,
		default: () => () => {},
	},
	inDisplayMode: {
		type: Boolean,
		default: () => false,
	},
});

const inDisplayModeRef = ref(props.inDisplayMode);
const hasContent = computed(() => !!props.workItem?.id);

function editForm() {
	inDisplayModeRef.value = false;
}

const onClose = function () {
	if (props.inDisplayMode) {
		inDisplayModeRef.value = true;
	} else {
		props.onCloseFn();
	}
};

const {form, set, badgeProps} = useDiscussionManagerForm(
	props,
	inDisplayModeRef,
);
</script>
