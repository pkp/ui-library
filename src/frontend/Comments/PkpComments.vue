<template>
	<PkpBaseCommentsVersions>
		<PkpBaseCommentsVersion class="w-96">
			<PkpBaseCommentsVersionHeader>
				<PkpBaseCommentsVersionHeaderTrigger
					class="group flex w-full justify-between"
				>
					<PkpBaseCommentsVersionHeaderLabel></PkpBaseCommentsVersionHeaderLabel>
					<PkpBaseCommentsVersionHeaderChevron
						class="inline-block transition-transform duration-300 group-data-[state=open]:rotate-180"
					></PkpBaseCommentsVersionHeaderChevron>
				</PkpBaseCommentsVersionHeaderTrigger>
			</PkpBaseCommentsVersionHeader>
			<PkpBaseCommentsVersionContent>
				<PkpBaseCommentsLogInto></PkpBaseCommentsLogInto>
				<PkpBaseCommentsNew>
					<PkpBaseCommentsNewInput></PkpBaseCommentsNewInput>
					<PkpBaseCommentsNewSubmit class="my-2"></PkpBaseCommentsNewSubmit>
				</PkpBaseCommentsNew>
				<PkpBaseCommentsMessages class="flex flex-col gap-y-2">
					<template #item="item">
						<PkpBaseCommentsMessage
							v-bind="item"
							class="rounded bg-default p-4"
						>
							<div class="flex justify-between">
								<PkpBaseCommentsMessageDate
									class="text-sm-light"
								></PkpBaseCommentsMessageDate>
								<PkpBaseCommentsMessageActions></PkpBaseCommentsMessageActions>
							</div>
							<PkpBaseCommentsMessageBody
								class="mt-2 block text-lg-normal"
							></PkpBaseCommentsMessageBody>

							<PkpBaseCommentsMessageAuthor class="mt-2 flex flex-col">
								<PkpBaseCommentsMessageAuthorName
									class="text-base-bold"
								></PkpBaseCommentsMessageAuthorName>
								<PkpBaseCommentsMessageAuthorOrcid
									class="text-xs-normal"
								></PkpBaseCommentsMessageAuthorOrcid>
								<PkpBaseCommentsMessageAuthorAffiliation
									class="text-sm-light"
								></PkpBaseCommentsMessageAuthorAffiliation>
							</PkpBaseCommentsMessageAuthor>
						</PkpBaseCommentsMessage>
					</template>
				</PkpBaseCommentsMessages>
			</PkpBaseCommentsVersionContent>
		</PkpBaseCommentsVersion>
	</PkpBaseCommentsVersions>
</template>

<script setup>
import PkpBaseCommentsVersions from './PkpBaseCommentsVersions.vue';
import PkpBaseCommentsVersion from './PkpBaseCommentsVersion.vue';
import PkpBaseCommentsNew from './PkpBaseCommentsNew.vue';
import PkpBaseCommentsNewInput from './PkpBaseCommentsNewInput.vue';
import PkpBaseCommentsNewSubmit from './PkpBaseCommentsNewSubmit.vue';
import PkpBaseCommentsVersionHeader from './PkpBaseCommentsVersionHeader.vue';
import PkpBaseCommentsVersionHeaderTrigger from './PkpBaseCommentsVersionHeaderTrigger.vue';
import PkpBaseCommentsVersionHeaderLabel from './PkpBaseCommentsVersionHeaderLabel.vue';
import PkpBaseCommentsVersionHeaderChevron from './PkpBaseCommentsVersionHeaderChevron.vue';

import PkpBaseCommentsVersionContent from './PkpBaseCommentsVersionContent.vue';

import PkpBaseCommentsLogInto from './PkpBaseCommentsLogInto.vue';
import PkpBaseCommentsMessages from './PkpBaseCommentsMessages.vue';
import PkpBaseCommentsMessage from './PkpBaseCommentsMessage.vue';
import PkpBaseCommentsMessageDate from './PkpBaseCommentsMessageDate.vue';
import PkpBaseCommentsMessageActions from './PkpBaseCommentsMessageActions.vue';
import PkpBaseCommentsMessageBody from './PkpBaseCommentsMessageBody.vue';
import PkpBaseCommentsMessageAuthor from './PkpBaseCommentsMessageAuthor.vue';
import PkpBaseCommentsMessageAuthorName from './PkpBaseCommentsMessageAuthorName.vue';
import PkpBaseCommentsMessageAuthorOrcid from './PkpBaseCommentsMessageAuthorOrcid.vue';
import PkpBaseCommentsMessageAuthorAffiliation from './PkpBaseCommentsMessageAuthorAffiliation.vue';
</script>
