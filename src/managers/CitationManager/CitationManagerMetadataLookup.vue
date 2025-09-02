<template>
	<div>
		<div class="pkpFormField__heading pkpFormFieldLabel">
			{{ t('submission.citations.structured') }}
		</div>
		<div class="pkpFormField__description">
			{{ t('submission.citations.structured.description') }}
		</div>
		<div>
			<input
				class="pkpFormField--options__input"
				type="checkbox"
				id="citations-citationsMetadataLookup"
				@change="citationStore.citationsMetadataLookupChanged()"
				v-model="citationStore.citationsMetadataLookup"
			/>
			<label
				for="citations-citationsMetadataLookup"
				class="pkpFormField--options__optionLabel"
			>
				{{ t('submission.citations.structured.citationsMetadataLookup') }}
			</label>
		</div>
	</div>
</template>

<script setup>
import {useLocalize} from '@/composables/useLocalize';
import {useCitationManagerStore} from './citationManagerStore.js';

const {t} = useLocalize();

const citationStore = useCitationManagerStore();
</script>
