<template>
	<div class="previewModal">
		<pkp-button ref="modalReportButton" @click="isModalOpened = true">
			Modal with Custom Actions
		</pkp-button>
		<modal
			closeLabel="Close"
			title="Activity Report"
			:open="isModalOpened"
			@close="isModalOpened = false"
		>
			<list>
				<list-item>
					<template #value>
						<icon icon="comment-o" :inline="true" />
						23
					</template>
					Emails sent today
				</list-item>
				<list-item>
					<template #value>
						<icon icon="file-text-o" :inline="true" />
						9
					</template>
					Submissions rejected today
				</list-item>
			</list>
			<template #footer>
				<spinner v-if="isSendingReport" />
				<pkp-button
					:isDisabled="isSendingReport"
					:isPrimary="true"
					@click="sendEmailReport"
				>
					Send Email Report
				</pkp-button>
				<pkp-button
					:isDisabled="isSendingReport"
					@click="isModalOpened = false"
				>
					Close
				</pkp-button>
			</template>
		</modal>
	</div>
</template>

<script>
import List from '@/components/List/List.vue';
import ListItem from '@/components/List/ListItem.vue';
import Modal from '@/components/Modal/Modal.vue';

export default {
	components: {
		List,
		ListItem,
		Modal,
	},
	data() {
		return {
			isModalOpened: false,
			isSendingReport: false,
		};
	},
	methods: {
		sendEmailReport() {
			this.isSendingReport = true;
			// Simulate a server request
			setTimeout(() => {
				this.isSendingReport = false;
				this.isModalOpened = false;
			}, 2000);
		},
	},
};
</script>
