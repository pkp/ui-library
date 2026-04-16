<template>
	<PkpButton
		v-if="
			!commentsStore.getCurrentUser() &&
			commentsStore.isLatestPublication(publication.id)
		"
		:class="cn('root')"
		@click="commentsStore.login"
	>
		{{ t('userComment.login') }}
	</PkpButton>
</template>

<script setup>
import PkpButton from '@/frontend/components/PkpButton/PkpButton.vue';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpCommentsStore} from './usePkpCommentsStore';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

const props = defineProps({
	publication: {type: Object, required: true},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpCommentsLogInto', props.styles);

const commentsStore = usePkpCommentsStore();
const {t} = usePkpLocalize();
</script>
