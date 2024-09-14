<template>
	<PkpButton is-secondary @click="() => store.createNewPublicationVersion()">
		{{ t('publication.createVersion') }}
	</PkpButton>
</template>
<script setup>
import PkpButton from '@/components/Button/Button.vue';
import {useLocalize} from '@/composables/useLocalize';

const {t} = useLocalize();

import {useSubmissionSummaryStore} from '../submissionSummaryStore';

const store = useSubmissionSummaryStore();
</script>
