/**
 * Store with common methods, getters, and fields uses across multiple DOI related components.
 */

import {computed} from 'vue';
import {defineComponentStore} from '@/utils/defineComponentStore';
import {useLocalize} from '@/composables/useLocalize';

const {t} = useLocalize();

export const useDoiStore = defineComponentStore('doiStore', (props) => {
	/**
	 * Gets string for DOI deposit display
	 * @param {number} itemDepositStatus - The item's DOI status
	 * @param {Boolean} hasDoi - Boolean indicating if the item has a DOI
	 * @return {String}
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
	 * Whether deposited metadata is out of sync with current metadata
	 * @param status - Current DOI status
	 * @returns {boolean}
	 */
	function isStale(status) {
		return status === pkp.const.DOI_STATUS_STALE;
	}
	const currentVersionDoiObjects = computed(() => {
		return props.item.doiObjects.filter(
			(doiObject) => doiObject.isCurrentVersion,
		);
	});

	/**
	 * Gets the deposit status for the item as a whole to display when in collapsed view.
	 * NB: Uses current publication as reference.
	 * FIXME: Handle different statuses for a single item (not possible with Crossref plugin currently)
	 */
	const itemDepositStatus = computed(() => {
		return currentVersionDoiObjects.value.length !== 0
			? currentVersionDoiObjects.value[0]['depositStatus']
			: pkp.const.DOI_STATUS_UNREGISTERED;
	});

	/**
	 * Whether item has the DOI_STATUS_ERROR status.
	 * Returns an object with key-value pairing indicating if the item has the DOI_STATUS_ERROR status.
	 * Key is the object's id, value is boolean indicating if the item has the DOI_STATUS_ERROR status.'
	 */
	const hasErrors = computed(() => {
		const results = {
			[props.item.id]: itemDepositStatus.value === pkp.const.DOI_STATUS_ERROR,
		};

		props.item.doiObjects.forEach((doiObject) => {
			results[doiObject.id] =
				doiObject.depositStatus === pkp.const.DOI_STATUS_ERROR;
		});
		return results;
	});

	/**
	 * Object containing key-value pairing indication if DOIs (doi of top level object and sub items) are deposited.
	 * Key is the object's id, value is boolean indicating if deposited.
	 *
	 * @return {Object}
	 */
	const isDeposited = computed(() => {
		const depositedStatuses = [
			pkp.const.DOI_STATUS_SUBMITTED,
			pkp.const.DOI_STATUS_REGISTERED,
		];

		// Calculate deposit status for top item
		const results = {
			[props.item.id]: depositedStatuses.includes(itemDepositStatus.value),
		};

		props.item.doiObjects.forEach((doiObject) => {
			results[doiObject.id] = depositedStatuses.includes(
				doiObject.depositStatus,
			);
		});

		return results;
	});

	/**
	 * Display string for publication status
	 *
	 * @return {String}
	 */
	const publicationStatusLabel = computed(() => {
		if (props.item.isPublished) {
			return t('publication.status.published');
		} else {
			return t('publication.status.unpublished');
		}
	});

	/**
	 * Whether registration agency plugin is enabled and configured
	 */
	const isRegistrationPluginConfigured = computed(() => {
		return props.registrationAgencyInfo['isConfigured'];
	});

	return {
		getDepositStatusString,
		isStale,
		// getters
		currentVersionDoiObjects,
		itemDepositStatus,
		hasErrors,
		isDeposited,
		publicationStatusLabel,
		isRegistrationPluginConfigured,
	};
});
