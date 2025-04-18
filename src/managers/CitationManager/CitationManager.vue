<template></template>

<script setup>
import {useId} from 'vue';

import {useCitationManagerStore} from './citationManagerStore.js';
import {useLocalize} from '@/composables/useLocalize.js';

const {t} = useLocalize();
const headingId = useId();

const Components = {};

const props = defineProps({
	submission: {type: Object, required: true},
	reviewRoundId: {type: Number, required: true},
	redactedForAuthors: {type: Boolean, required: false, default: false},
	componentForms: {type: Object, required: true},
});

const citationStore = useCitationManagerStore(props);
</script>
