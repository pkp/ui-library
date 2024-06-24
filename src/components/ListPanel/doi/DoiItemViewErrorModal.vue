<template>
	<SideModalBody>
		<template #title>
			{{ t('manager.dois.registration.viewError.title') }}
		</template>
		<SideModalLayoutBasic>
			<p>{{ errorMessageAgencyPreamble }}</p>
			<div class="depositErrorMessage">
				<pre>{{ errorMessage }}</pre>
			</div>
		</SideModalLayoutBasic>
	</SideModalBody>
</template>

<script setup>
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import {useLocalize} from '@/composables/useLocalize';
defineProps({
	errorMessageAgencyPreamble: {type: String, required: true},
	errorMessage: {type: String, required: true},
});
const {t} = useLocalize();
</script>
