<template>
	<div v-if="notificationsToDisplay?.length" class="flex flex-row space-y-3">
		<div
			v-for="(notification, i) in notificationsToDisplay"
			:key="i"
			class="w-full border border-light p-3"
		>
			<h3 class="text-lg-bold text-heading">{{ notification.title }}</h3>
			<p class="pt-2 text-base-normal">{{ notification.text }}</p>
		</div>
	</div>
</template>
<script setup>
import {computed, watch} from 'vue';
import {useUrl} from '@/composables/useUrl';
import {useFetch} from '@/composables/useFetch';
import {useApp} from '@/composables/useApp';
import {useDataChanged} from '@/composables/useDataChanged';

const props = defineProps({
	submission: {type: Object, required: true},
	selectedStageId: {type: Number, required: true},
});

const {pageUrl} = useUrl(`notification/fetchNotification`);
const {isOJS, isOMP} = useApp();

function getRequestOptionsPerStage(stageId) {
	switch (stageId) {
		case pkp.const.WORKFLOW_STAGE_ID_EDITING:
			return {
				[pkp.const.NOTIFICATION_LEVEL_NORMAL]: {
					[pkp.const.NOTIFICATION_TYPE_ASSIGN_COPYEDITOR]: {
						assocType: pkp.const.ASSOC_TYPE_SUBMISSION,
						assocId: props.submission.id,
					},
					[pkp.const.NOTIFICATION_TYPE_AWAITING_COPYEDITS]: {
						assocType: pkp.const.ASSOC_TYPE_SUBMISSION,
						assocId: props.submission.id,
					},
				},
				[pkp.const.NOTIFICATION_LEVEL_TRIVIAL]: 0,
			};
		case pkp.const.WORKFLOW_STAGE_ID_PRODUCTION:
			if (isOJS()) {
				return {
					[pkp.const.NOTIFICATION_LEVEL_NORMAL]: {
						[pkp.const.NOTIFICATION_TYPE_ASSIGN_PRODUCTIONUSER]: {
							assocType: pkp.const.ASSOC_TYPE_SUBMISSION,
							assocId: props.submission.id,
						},
						[pkp.const.NOTIFICATION_TYPE_AWAITING_REPRESENTATIONS]: {
							assocType: pkp.const.ASSOC_TYPE_SUBMISSION,
							assocId: props.submission.id,
						},
					},
					[pkp.const.NOTIFICATION_LEVEL_TRIVIAL]: 0,
				};
			} else if (isOMP()) {
				return {
					[pkp.const.NOTIFICATION_LEVEL_NORMAL]: {
						[pkp.const.NOTIFICATION_TYPE_VISIT_CATALOG]: {
							assocType: pkp.const.ASSOC_TYPE_SUBMISSION,
							assocId: props.submission.id,
						},
						[pkp.const.NOTIFICATION_TYPE_FORMAT_NEEDS_APPROVED_SUBMISSION]: {
							assocType: pkp.const.ASSOC_TYPE_SUBMISSION,
							assocId: props.submission.id,
						},
					},
					[pkp.const.NOTIFICATION_LEVEL_TRIVIAL]: 0,
				};
			}
			return null;
		default:
			return null;
	}
}

function objectToFormData(obj, formData = new FormData(), parentKey = '') {
	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			const value = obj[key];
			const formKey = parentKey ? `${parentKey}[${key}]` : key;

			if (typeof value === 'object' && value !== null) {
				objectToFormData(value, formData, formKey);
			} else {
				formData.append(formKey, value);
			}
		}
	}
	return formData;
}

const requestBody = computed(() => {
	const requestOptions = getRequestOptionsPerStage(props.selectedStageId);
	if (requestOptions) {
		return objectToFormData({requestOptions});
	}
	return null;
});
const {data, fetch} = useFetch(pageUrl, {
	method: 'POST',
	body: requestBody,
});

watch(
	requestBody,
	(requestBodyNew) => {
		data.value = null;
		if (requestBodyNew) {
			fetch();
		}
	},
	{immediate: true},
);

/** Reload notifications when data on screen changes */
useDataChanged(() => fetch());

const notificationsToDisplay = computed(() => {
	const notifications = [];
	const general = data?.value?.content?.general;
	if (!general) {
		return [];
	}
	Object.values(general).forEach((notificationsWithinPriority) => {
		Object.values(notificationsWithinPriority).forEach((notification) => {
			notifications.push(notification);
		});
	});
	return notifications;
});
</script>
