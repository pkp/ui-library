<template>
	<div v-for="(notification, i) in notificationsToDisplay" :key="i">
		{{ notification.text }}
	</div>
</template>
<script setup>
import {computed} from 'vue';
import {useUrl} from '@/composables/useUrl';
import {useFetch} from '@/composables/useFetch';

const props = defineProps({submission: {type: Object, required: true}});

const {pageUrl} = useUrl(`notification/fetchNotification`);

/**
 *
 *
  return [
    Notification::NOTIFICATION_LEVEL_NORMAL => [
        Notification::NOTIFICATION_TYPE_VISIT_CATALOG => [Application::ASSOC_TYPE_SUBMISSION, $submissionId],
        Notification::NOTIFICATION_TYPE_ASSIGN_PRODUCTIONUSER => [Application::ASSOC_TYPE_SUBMISSION, $submissionId],
        Notification::NOTIFICATION_TYPE_AWAITING_REPRESENTATIONS => [Application::ASSOC_TYPE_SUBMISSION, $submissionId],
    ],
    Notification::NOTIFICATION_LEVEL_TRIVIAL => []
];

 *
 *
 */

const requestData = {
	requestOptions: {
		[pkp.const.NOTIFICATION_LEVEL_NORMAL]: {
			[pkp.const.NOTIFICATION_TYPE_VISIT_CATALOG]: {
				assocType: pkp.const.ASSOC_TYPE_SUBMISSION,
				assocId: props.submission.id,
			},
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
	},
};

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

const {data, fetch} = useFetch(pageUrl, {
	method: 'POST',
	body: objectToFormData(requestData),
});

fetch();

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
