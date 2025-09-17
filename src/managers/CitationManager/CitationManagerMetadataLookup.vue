<template>
	<div>
		<h3 class="font-bold leading-6">
			{{ t('submission.citations.structured') }}
		</h3>
		<div class="py-4 leading-8">
			{{ t('submission.citations.structured.citationsMetadataLookup.description') }}
		</div>
		<div>
			<Checkbox
				id="citations-citationsMetadataLookup"
				:label="t('submission.citations.structured.enableCitationsMetadataLookup')"
				:checked="!!citationStore.citationsMetadataLookup"
				:labelled-by="''"
				@change="citationStore.citationsMetadataLookupChanged"
			/>
		</div>
	</div>
</template>

<script setup>
import {useLocalize} from '@/composables/useLocalize';
import {useCitationManagerStore} from './citationManagerStore.js';
import Checkbox from '@/components/Checkbox/Checkbox.vue';

const {t} = useLocalize();

const citationStore = useCitationManagerStore();
</script>
