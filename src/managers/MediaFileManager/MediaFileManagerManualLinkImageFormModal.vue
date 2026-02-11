<template>
	<SideModalBody>
		<template #title>
			{{ t('publication.mediaFiles.manuallyLinkImage') }}
		</template>
		<SideModalLayoutBasic>
			<PkpForm v-bind="form" @cancel="closeModal" @set="set" />
		</SideModalLayoutBasic>
	</SideModalBody>
</template>

<script setup>
import {inject} from 'vue';
import {t} from '@/utils/i18n';
import {useMediaFileManagerManualLinkImageFormModal} from './useMediaFileManagerManualLinkImageFormModal';

import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import PkpForm from '@/components/Form/Form.vue';

const closeModal = inject('closeModal');

const props = defineProps({
	/** The media file to link an image to */
	mediaFile: {
		type: Object,
		required: true,
	},
});

const {form, set} = useMediaFileManagerManualLinkImageFormModal(
	props.mediaFile,
);
</script>
