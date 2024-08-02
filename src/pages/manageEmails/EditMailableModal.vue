<template>
	<SideModalBody>
		<template #title>
			{{ title }}
		</template>
		<SideModalLayoutBasic>
			<p>{{ mailable.description }}</p>
			<p>{{ t('manager.mailables.addTemplates') }}</p>
			<ListPanel :items="mailable.emailTemplates">
				<template #header>
					<PkpHeader>
						<h3>{{ t('manager.mailables.templates') }}</h3>
						<template #actions>
							<PkpButton @click="() => emit('openTemplate', null)">
								{{ t('manager.emails.addEmail') }}
							</PkpButton>
						</template>
					</PkpHeader>
				</template>
				<template #item-subtitle="{item}">
					{{ localize(item.name) }}
				</template>
				<template #item-actions="{item}">
					<Badge v-if="item.key === mailable.emailTemplateKey">
						{{ t('common.default') }}
					</Badge>
					<PkpButton @click="() => emit('openTemplate', item)">
						{{ t('common.edit') }}
					</PkpButton>
					<PkpButton
						v-if="item.key === mailable.emailTemplateKey && item.id"
						:is-warnable="true"
						@click="() => emit('confirmResetTemplate', item)"
					>
						{{ t('common.reset') }}
					</PkpButton>
					<PkpButton
						v-else-if="item.id"
						:is-warnable="true"
						@click="emit('confirmRemoveTemplate', item)"
					>
						{{ t('common.remove') }}
					</PkpButton>
				</template>
			</ListPanel>
		</SideModalLayoutBasic>
	</SideModalBody>
</template>
<script setup>
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import {useLocalize} from '@/composables/useLocalize';
import PkpHeader from '@/components/Header/Header.vue';
import PkpButton from '@/components/Button/Button.vue';
import Badge from '@/components/Badge/Badge.vue';

const {t, localize} = useLocalize();

defineProps({
	title: {type: String, required: true},
	mailable: {type: Object, required: true},
});

const emit = defineEmits([
	'openTemplate',
	'confirmResetTemplate',
	'confirmRemoveTemplate',
]);
</script>
