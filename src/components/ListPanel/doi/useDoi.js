import {computed, toRef} from 'vue';
import {useLocalize} from '@/composables/useLocalize';

export function useDoi(props) {
	const {t} = useLocalize();

	const item = toRef(props, 'item');
	const registrationAgencyInfo = toRef(props, 'registrationAgencyInfo');

	/**
	 * Gets string for DOI deposit display
	 */
	function getDepositStatusString(itemDepositStatus, hasDoi) {
		switch (itemDepositStatus) {
			case pkp.const.DOI_STATUS_UNREGISTERED:
				return !hasDoi
					? t('manager.dois.status.needsDoi')
					: t('manager.dois.status.unregistered');

			case pkp.const.DOI_STATUS_SUBMITTED:
				return t('manager.dois.status.submitted');

			case pkp.const.DOI_STATUS_REGISTERED:
				return t('manager.dois.status.registered');

			case pkp.const.DOI_STATUS_ERROR:
				return t('manager.dois.status.error');

			case pkp.const.DOI_STATUS_STALE:
				return t('manager.dois.status.stale');

			default:
				return '';
		}
	}

	/**
	 * Whether deposited metadata is out of sync
	 */
	function isStale(status) {
		return status === pkp.const.DOI_STATUS_STALE;
	}

	/**
	 * Gets DOI objects for current publication version only
	 * @returns {DoiObject[]}
	 */
	const currentVersionDoiObjects = computed(() => {
		return item.value.doiObjects.filter(
			(doiObject) => doiObject.isCurrentVersion,
		);
	});

	/**
	 * Deposit status for top-level item
	 */
	const itemDepositStatus = computed(() => {
		return currentVersionDoiObjects.value.length !== 0
			? currentVersionDoiObjects?.value?.[0]?.depositStatus
			: pkp.const.DOI_STATUS_UNREGISTERED;
	});

	/**
	 * Check if an DOI object has any errors.
	 * @param {Number} status - Status of the DOI object.
	 */
	function hasErrors(status) {
		return status === pkp.const.DOI_STATUS_ERROR;
	}

	/**
	 * Check if a DOI object is deposited.
	 * @param {Number} status - Status of the DOI object.
	 */
	function isDeposited(status) {
		return [
			pkp.const.DOI_STATUS_SUBMITTED,
			pkp.const.DOI_STATUS_REGISTERED,
		].includes(status);
	}

	/**
	 * Publication status label
	 */
	const publicationStatusLabel = computed(() => {
		return item.value.isPublished
			? t('publication.status.published')
			: t('publication.status.unpublished');
	});

	/**
	 * Whether registration plugin is configured
	 */
	const isRegistrationPluginConfigured = computed(() => {
		return registrationAgencyInfo.value.isConfigured;
	});

	return {
		getDepositStatusString,
		isStale,

		currentVersionDoiObjects,
		itemDepositStatus,
		hasErrors,
		isDeposited,
		publicationStatusLabel,
		isRegistrationPluginConfigured,
	};
}
