<template>
	{{ someValue }}
	-- FieldAuthorAffiliation --
</template>

<script setup>
import {ref, computed} from 'vue';
import {defineProps} from 'vue';

import {useFieldAuthorAffiliationStore} from './FieldAuthorAffiliation.stories';

// Define Page Props
const props = defineProps({
	/** URL to fetch institutions from API */
	institutionsApiUrl: {type: String, required: true},
	items: { type: Array, required: true },
	someValue: ref('hello someValue'),
});

// Initialise store
useFieldAuthorAffiliationStore(props);
</script>
