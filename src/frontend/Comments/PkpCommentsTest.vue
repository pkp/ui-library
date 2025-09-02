<template>
	<BaseComments v-bind="$attrs">
		<BaseCommentsVersions v-slot="versionProps">
			<BaseCommentsVersion class="w-96" v-bind="versionProps">
				<BaseCommentsVersionHeader>
					<BaseCommentsVersionHeaderTrigger
						class="group flex w-full justify-between"
					>
						<BaseCommentsVersionHeaderLabel></BaseCommentsVersionHeaderLabel>
						<BaseCommentsVersionHeaderChevron
							class="inline-block transition-transform duration-300 group-data-[state=open]:rotate-180"
						></BaseCommentsVersionHeaderChevron>
					</BaseCommentsVersionHeaderTrigger>
				</BaseCommentsVersionHeader>
				<BaseCommentsVersionContent>
					<BaseCommentsLogInto></BaseCommentsLogInto>
					<BaseCommentsNotificationNotLatest></BaseCommentsNotificationNotLatest>
					<BaseCommentsNew>
						<BaseCommentsNewInput></BaseCommentsNewInput>
						<BaseCommentsNewSubmit class="my-2"></BaseCommentsNewSubmit>
					</BaseCommentsNew>
					<BaseCommentsMessages class="flex flex-col gap-y-2">
						<template #default="messageProps">
							<BaseCommentsMessage
								v-bind="messageProps"
								class="rounded bg-default p-4"
							>
								<BaseCommentsMessageIsApproved />
								<div class="flex justify-between">
									<BaseCommentsMessageDate
										class="text-sm-light"
									></BaseCommentsMessageDate>
									<BaseCommentsMessageActions></BaseCommentsMessageActions>
								</div>
								<BaseCommentsMessageBody
									class="mt-2 block text-lg-normal"
								></BaseCommentsMessageBody>

								<BaseCommentsMessageAuthor class="mt-2 flex flex-col">
									<BaseCommentsMessageAuthorName
										class="text-base-bold"
									></BaseCommentsMessageAuthorName>
									<BaseCommentsMessageAuthorOrcid
										class="text-xs-normal"
									></BaseCommentsMessageAuthorOrcid>
									<BaseCommentsMessageAuthorAffiliation
										class="text-sm-light"
									></BaseCommentsMessageAuthorAffiliation>
								</BaseCommentsMessageAuthor>
							</BaseCommentsMessage>
						</template>
					</BaseCommentsMessages>
				</BaseCommentsVersionContent>
			</BaseCommentsVersion>
		</BaseCommentsVersions>
	</BaseComments>
</template>

<script setup>
import BaseComments from './BaseComments.vue';
import BaseCommentsVersions from './BaseCommentsVersions.vue';
import BaseCommentsVersion from './BaseCommentsVersion.vue';
import BaseCommentsNew from './BaseCommentsNew.vue';
import BaseCommentsNewInput from './BaseCommentsNewInput.vue';
import BaseCommentsNewSubmit from './BaseCommentsNewSubmit.vue';
import BaseCommentsVersionHeader from './BaseCommentsVersionHeader.vue';
import BaseCommentsVersionHeaderTrigger from './BaseCommentsVersionHeaderTrigger.vue';
import BaseCommentsVersionHeaderLabel from './BaseCommentsVersionHeaderLabel.vue';
import BaseCommentsVersionHeaderChevron from './BaseCommentsVersionHeaderChevron.vue';

import BaseCommentsVersionContent from './BaseCommentsVersionContent.vue';

import BaseCommentsLogInto from './BaseCommentsLogInto.vue';
import BaseCommentsMessages from './BaseCommentsMessages.vue';
import BaseCommentsNotificationNotLatest from './BaseCommentsNotificationNotLatest.vue';
import BaseCommentsMessage from './BaseCommentsMessage.vue';
import BaseCommentsMessageIsApproved from './BaseCommentsMessageIsApproved.vue';
import BaseCommentsMessageDate from './BaseCommentsMessageDate.vue';
import BaseCommentsMessageActions from './BaseCommentsMessageActions.vue';
import BaseCommentsMessageBody from './BaseCommentsMessageBody.vue';
import BaseCommentsMessageAuthor from './BaseCommentsMessageAuthor.vue';
import BaseCommentsMessageAuthorName from './BaseCommentsMessageAuthorName.vue';
import BaseCommentsMessageAuthorOrcid from './BaseCommentsMessageAuthorOrcid.vue';
import BaseCommentsMessageAuthorAffiliation from './BaseCommentsMessageAuthorAffiliation.vue';
</script>
./BaseCommentsNotificationMessageApproved.vue
