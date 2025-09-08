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
								<BaseCommentsNotificationMessageApproved />
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
import BaseComments from './base/BaseComments.vue';
import BaseCommentsVersions from './base/BaseCommentsVersions.vue';
import BaseCommentsVersion from './base/BaseCommentsVersion.vue';
import BaseCommentsNew from './base/BaseCommentsNew.vue';
import BaseCommentsNewInput from './base/BaseCommentsNewInput.vue';
import BaseCommentsNewSubmit from './base/BaseCommentsNewSubmit.vue';
import BaseCommentsVersionHeader from './base/BaseCommentsVersionHeader.vue';
import BaseCommentsVersionHeaderTrigger from './base/BaseCommentsVersionHeaderTrigger.vue';
import BaseCommentsVersionHeaderLabel from './base/BaseCommentsVersionHeaderLabel.vue';
import BaseCommentsVersionHeaderChevron from './base/BaseCommentsVersionHeaderChevron.vue';

import BaseCommentsVersionContent from './base/BaseCommentsVersionContent.vue';

import BaseCommentsLogInto from './base/BaseCommentsLogInto.vue';
import BaseCommentsMessages from './base/BaseCommentsMessages.vue';
import BaseCommentsNotificationNotLatest from './base/BaseCommentsNotificationNotLatest.vue';
import BaseCommentsMessage from './base/BaseCommentsMessage.vue';
import BaseCommentsNotificationMessageApproved from './base/BaseCommentsNotificationMessageApproved.vue';
import BaseCommentsMessageDate from './base/BaseCommentsMessageDate.vue';
import BaseCommentsMessageActions from './base/BaseCommentsMessageActions.vue';
import BaseCommentsMessageBody from './base/BaseCommentsMessageBody.vue';
import BaseCommentsMessageAuthor from './base/BaseCommentsMessageAuthor.vue';
import BaseCommentsMessageAuthorName from './base/BaseCommentsMessageAuthorName.vue';
import BaseCommentsMessageAuthorOrcid from './base/BaseCommentsMessageAuthorOrcid.vue';
import BaseCommentsMessageAuthorAffiliation from './base/BaseCommentsMessageAuthorAffiliation.vue';
</script>
