<template>
	<div class="previewModal">
		<pkp-button ref="modalReportButton" @click="$modal.show('report')">
			Modal with Custom Actions
		</pkp-button>
		<modal
			closeLabel="Close"
			name="report"
			title="Activity Report"
			@closed="setFocusToRef('modalReportButton')"
		>
			<list>
				<list-item>
					<template slot="value">
						<icon icon="comment-o" :inline="true" />
						23
					</template>
					Emails sent today
				</list-item>
				<list-item>
					<template slot="value">
						<icon icon="file-text-o" :inline="true" />
						9
					</template>
					Submissions rejected today
				</list-item>
			</list>
			<template slot="footer">
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
					@click="$modal.hide('report')"
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
		Modal
	},
	data() {
		return {
			isSendingReport: false
		};
	},
	methods: {
		sendEmailReport() {
			this.isSendingReport = true;
			// Simulate a server request
			setTimeout(() => {
				this.isSendingReport = false;
				this.$modal.hide('report');
			}, 2000);
		}
	}
};
</script>
