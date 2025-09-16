<template>
	<PkpBaseCommentsVersions>
		<PkpBaseCommentsVersion>
			<PkpBaseCommentsVersionHeader>
				<PkpBaseCommentsVersionHeaderTrigger>
					<PkpBaseCommentsVersionHeaderLabel></PkpBaseCommentsVersionHeaderLabel>
					<PkpBaseCommentsVersionHeaderChevron></PkpBaseCommentsVersionHeaderChevron>
				</PkpBaseCommentsVersionHeaderTrigger>
			</PkpBaseCommentsVersionHeader>
			<PkpBaseCommentsVersionContent>
				<PkpBaseCommentsLogInto></PkpBaseCommentsLogInto>
				<PkpBaseCommentsNew>
					<PkpBaseCommentsNewInput></PkpBaseCommentsNewInput>
					<PkpBaseCommentsNewSubmit></PkpBaseCommentsNewSubmit>
				</PkpBaseCommentsNew>
				<PkpBaseCommentsMessages>
					<template #item="data">
						<PkpBaseCommentsMessage v-bind="data">
							<PkpBaseCommentsMessageDate></PkpBaseCommentsMessageDate>
							<PkpBaseCommentsMessageActions></PkpBaseCommentsMessageActions>
							<PkpBaseCommentsMessageBody></PkpBaseCommentsMessageBody>

							<PkpBaseCommentsMessageAuthor>
								<PkpBaseCommentsMessageAuthorName></PkpBaseCommentsMessageAuthorName>
								<PkpBaseCommentsMessageAuthorOrcid></PkpBaseCommentsMessageAuthorOrcid>
								<PkpBaseCommentsMessageAuthorAffiliation></PkpBaseCommentsMessageAuthorAffiliation>
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
