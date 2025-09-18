<template>
	<div>
		<h3 class="font-bold leading-6">
			{{ t('submission.citations') }}
		</h3>
		<div class="py-4 leading-6">
			{{ t('submission.citations.structured.description') }}
		</div>
		<div>
			<textarea
				v-model="citationStore.citationsRawToBeAdded"
				class="border-gray-600 min-h-20 w-full border p-2"
				:disabled="!citationStore.canEditPublication"
			></textarea>
		</div>
		<div>
			<PkpButton
				class="my-2"
				:is-disabled="!citationStore.canEditPublication"
				@click="citationStore.handleAddCitationsRawToList"
			>
				{{ t('common.add') }}
			</PkpButton>
			<span
				v-if="citationStore.citationsRawShowMessage === 'isEmpty'"
				class="align-middle"
			>
				<Icon
					:icon="'Declined'"
					:class="'inline-block h-auto w-6 align-middle'"
					:inline="true"
				/>
				<span class="align-middle">
					{{ t('submission.citations.structured.addRaw.empty') }}
				</span>
			</span>
			<span v-if="citationStore.citationsRawShowMessage === 'isLoading'">
				<Spinner />
			</span>
			<span
				v-if="citationStore.citationsRawShowMessage === 'isSuccess'"
				class="items-center py-2 text-success"
			>
				<Icon
					:icon="'Complete'"
					:class="'inline-block h-auto w-6 align-middle'"
					:inline="true"
				/>
				<span class="align-middle">
					{{ t('submission.citations.structured.addRaw.success') }}
				</span>
			</span>
			<span
				v-if="citationStore.citationsRawShowMessage === 'isPartial'"
				class="items-center py-2 text-attention"
			>
				<Icon
					:icon="'InProgress'"
					:class="'inline-block h-auto w-6 align-middle'"
					:inline="true"
				/>
				<span class="align-middle">
					{{ t('submission.citations.structured.addRaw.partialSuccess') }}
				</span>
			</span>
		</div>
	</div>
</template>

<script setup>
import {useLocalize} from '@/composables/useLocalize';
import PkpButton from '@/components/Button/Button.vue';
import {useCitationManagerStore} from './citationManagerStore.js';
import Icon from '@/components/Icon/Icon.vue';
import Spinner from '@/components/Spinner/Spinner.vue';

const {t} = useLocalize();

const citationStore = useCitationManagerStore();
</script>
