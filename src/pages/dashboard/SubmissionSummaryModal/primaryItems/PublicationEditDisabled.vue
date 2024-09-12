<template>
	<div
		class="bg -mx-5 -mt-5 bg-attention p-5 text-center text-base-normal text-on-dark"
	>
		{{ t('publication.editDisabled') }}
	</div>
</template>

<script setup>
import {useLocalize} from '@/composables/useLocalize';

const {t} = useLocalize();
</script>
