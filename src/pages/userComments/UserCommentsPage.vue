<template>
	<div>
		<span>
			<h1 class="flex-inline items-center gap-4 py-6 text-5xl-bold">
				<span class="text-heading">
					{{ t('manager.userComment.comments') }}
				</span>
				<span class="ms-3">
					<Spinner
						size-variant="big"
						:class="!userCommentStore.isCommentsLoading ? 'invisible' : ''"
					/>
				</span>
			</h1>
		</span>
		<Tabs
			:track-history="true"
			:active-tab="userCommentStore.activeTab"
			:label="t('manager.userComment.userComments')"
			@update:active-tab="(tabId) => userCommentStore.onTabUpdate(tabId)"
		>
			<Tab
				v-for="(tab, index) in userCommentStore.commentTabOptions"
				:id="tab.id"
				:key="index"
				:label="tab.label"
			>
				<UserCommentsTable :items="userCommentStore.comments" />
			</Tab>
		</Tabs>
	</div>
</template>
<script setup>
import {useLocalize} from '@/composables/useLocalize';
import {useUserCommentStore} from '@/pages/userComments/userCommentStore';
import Tabs from '@/components/Tabs/Tabs.vue';
import Tab from '@/components/Tabs/Tab.vue';
import UserCommentsTable from '@/pages/userComments/UserCommentsTable.vue';
import Spinner from '@/components/Spinner/Spinner.vue';

const props = defineProps({
	/**
	 * Number of items to fetch and display per page in pagination.
	 */
	itemsPerPage: {
		type: Number,
		required: true,
	},
});

const userCommentStore = useUserCommentStore(props);
const {t} = useLocalize();
</script>
