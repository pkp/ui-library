<template>
	<SideModalBody>
		<template #title>Title TODO</template>
		<div class="p-4">
			<div class="bg-secondary p-5">
				Here goes all metadata, submissionId: {{ store.submissionId }}, roundId:
				{{ store.reviewRoundId }}

				<div v-if="store.submission">
					<div class="text-xl-bold">
						{{ localize(store.submission.publications[0].title) }}
					</div>
				</div>
			</div>
		</div>
	</SideModalBody>
</template>

<script setup>
import {defineProps} from 'vue';
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import {useTranslation} from '@/composables/useTranslation';
import {useRoundHistoryModalStore} from './roundHistoryModalStore';

const props = defineProps({
	submissionId: {type: Number, required: true},
	reviewRoundId: {type: Number, required: true},
});

const {localize} = useTranslation();

const store = useRoundHistoryModalStore(props);
</script>
