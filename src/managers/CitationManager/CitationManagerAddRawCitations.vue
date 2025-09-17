<template>
	<div>
		<h3 class="leading-6 font-bold">
			{{ t('submission.citations') }}
		</h3>
		<div class="leading-8 py-4">
			{{ t('submission.citations.structured.description') }}
		</div>
		<div>
			<textarea
				v-model="citationStore.citationsRawToBeAdded"
				class="w-full pt-2 pb-2 leading-8 border border-gray-600 !min-h-18"
			></textarea>
		</div>
		<div>
			<PkpButton
				class="my-2"
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
