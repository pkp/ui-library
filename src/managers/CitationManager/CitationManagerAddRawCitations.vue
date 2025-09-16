<template>
	<div>
		<div class="pkpFormField__heading pkpFormFieldLabel">
			{{ t('submission.citations') }}
		</div>
		<div class="pkpFormField__description py-4">
			{{ t('submission.citations.structured.description') }}
		</div>
		<div>
			<textarea
				class="pkpFormField__input pkpFormField--textarea__input !h-[9em]"
				v-model="citationStore.citationsRawToBeAdded"
			></textarea>
		</div>
		<div>
			<PkpButton
				class="my-2"
				:is-required="true"
				:disabled="!citationStore.citationsRawToBeAdded"
				@click="citationStore.handleAddCitationsRawToList"
			>
				{{ t('common.add', {}) }}
			</PkpButton>
			<span
				v-if="citationStore.citationsRawShowMessage === 'success'"
				class="items-center py-[0.5rem] text-success"
			>
				<Icon
					:icon="'Complete'"
					:class="'inline-block h-auto w-6 align-middle'"
					:inline="true"
				/>
				<span class="align-middle">
					<span class="font-normal">
						{{ t('submission.citations.structured.addRaw.success') }}
					</span>
				</span>
			</span>
			<span
				v-if="citationStore.citationsRawShowMessage === 'partial'"
				class="items-center py-[0.5rem] text-attention"
			>
				<Icon
					:icon="'InProgress'"
					:class="'inline-block h-auto w-6 align-middle'"
					:inline="true"
				/>
				<span class="align-middle">
					<span class="font-normal">
						{{ t('submission.citations.structured.addRaw.partialSuccess') }}
					</span>
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

const {t} = useLocalize();

const citationStore = useCitationManagerStore();
</script>
