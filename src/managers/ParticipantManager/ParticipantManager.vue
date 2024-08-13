<template>
	<div class="border border-light">
		<div class="flex items-center justify-between p-5">
			<h3 class="text-2xl-bold uppercase text-default">
				{{ t('editor.submission.stageParticipants') }}
			</h3>
			<PkpButton @click="participantManagerStore.handleAction(Actions.ASSIGN)">
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
				class="border-t border-light p-4 text-base-normal"
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
						</div>
					</div>
					<div>
						<DropdownActions
							:actions="participantManagerStore.itemActions"
							label="More Actions (todo)"
							:display-as-ellipsis="true"
							@action="
								(actionName) =>
									participantManagerStore.handleItemAction(actionName, {
										participant: participant,
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
import {Actions} from './useParticipantManagerActions';
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
