<template>
	<div class="border border-light" data-cy="participant-manager">
		<div class="flex items-center justify-between bg-default p-5">
			<h3 class="text-2xl-bold uppercase text-heading">
				{{ t('editor.submission.stageParticipants') }}
			</h3>
			<PkpButton @click="participantManagerStore.participantAssign()">
				{{ t('common.assign') }}
			</PkpButton>
		</div>
		<ul
			v-if="participantManagerStore.participantsList?.length"
			class="flex flex-col"
			role="list"
		>
			<li
				v-for="participant in participantManagerStore.participantsList"
				:key="participant.id"
				class="border-t border-light p-4 text-base-normal even:bg-tertiary"
			>
				<div class="flex items-center justify-between">
					<div class="flex">
						<div>
							<UserAvatar
								:user-id="participant.id"
								:user-full-name="participant.fullName"
							></UserAvatar>
						</div>
						<div class="ms-2 flex flex-col justify-center">
							<div class="text-base-bold">{{ participant.fullName }}</div>
							<div class="text-sm-normal text-secondary">
								{{ participant.roleName }}
							</div>
							<div
								v-if="participant.recommendOnly"
								class="mt-0.5 text-xs-normal text-heading"
							>
								{{ t('dashboard.recommendOnly.onlyAllowedToRecommend') }}
							</div>
						</div>
					</div>
					<div>
						<DropdownActions
							:actions="participantManagerStore.itemActions"
							:label="`${participant.fullName} ${t('common.moreActions')}`"
							:display-as-ellipsis="true"
							@action="
								(actionName) =>
									participantManagerStore[actionName]({
										participant: participant,
										stageAssignmen,
									})
							"
						/>
					</div>
				</div>
			</li>
		</ul>
	</div>
</template>
<script setup>
import UserAvatar from '@/components/UserAvatar/UserAvatar.vue';
import PkpButton from '@/components/Button/Button.vue';
import {useLocalize} from '@/composables/useLocalize';
import {useParticipantManagerStore} from './participantManagerStore';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';

const props = defineProps({
	submission: {type: Object, required: true},
	submissionStageId: {type: String, required: true},
});

const participantManagerStore = useParticipantManagerStore(props);

const {t} = useLocalize();
</script>
