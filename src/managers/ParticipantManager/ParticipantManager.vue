<template>
	<div class="border border-light" data-cy="participant-manager">
		<div class="flex items-center justify-between bg-default p-5">
			<h3 class="text-2xl-bold uppercase text-heading">
				{{ t('editor.submission.stageParticipants') }}
			</h3>
			<div class="flex gap-x-2">
				<component
					:is="Components[action.component] || action.component"
					v-bind="action.props || {}"
					v-for="(action, i) in participantManagerStore.topItems"
					:key="i"
				></component>
			</div>
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
								:initials="participant.displayInitials"
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
								{{ t('participantManager.onlyAllowedToRecommend') }}
							</div>
						</div>
					</div>
					<div>
						<DropdownActions
							:actions="participantManagerStore.getItemActions({participant})"
							:label="`${participant.fullName} ${t('common.moreActions')}`"
							button-variant="ellipsis"
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
import {useLocalize} from '@/composables/useLocalize';
import {useParticipantManagerStore} from './participantManagerStore';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';
import ParticipantManagerActionButton from './ParticipantManagerActionButton.vue';

const props = defineProps({
	submission: {type: Object, required: true},
	submissionStageId: {type: String, required: true},
});

const Components = {
	ParticipantManagerActionButton,
};

const participantManagerStore = useParticipantManagerStore(props);

const {t} = useLocalize();
</script>
