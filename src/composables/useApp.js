import {t} from '@/utils/i18n';

/**
 * Provides functions to check which PKP application is currently running
 */
export function useApp() {
	/**
	 * Check if the current application is Open Journal Systems
	 * @returns {boolean} True if the application is OJS
	 */
	function isOJS() {
		return pkp.context.app === 'ojs2';
	}

	/**
	 * Check if the current application is Open Monograph Press
	 * @returns {boolean} True if the application is OMP
	 */
	function isOMP() {
		return pkp.context.app === 'omp';
	}

	/**
	 * Check if the current application is Open Preprint Systems
	 * @returns {boolean} True if the application is OPS
	 */
	function isOPS() {
		return pkp.context.app === 'ops';
	}

	/**
	 * Get the list of supported locales for the current application.
	 *
	 * @returns {Object} An object of supported locale codes (e.g., {en: 'English', fr_CA: 'French'}).
	 */
	function getSupportedLocales() {
		return pkp.context.supportedLocales;
	}

	/**
	 * Get the list of form supported locales for the current application.
	 *
	 * @returns {Object} An object of supported locale codes (e.g., {en: 'English', fr_CA: 'French'}).
	 */
	function getSupportedFormLocales() {
		return pkp.context.supportedFormLocales;
	}

	/**
	 * Get the primary locale of the application.
	 *
	 * @returns {string} The current locale code (e.g., 'en').
	 */
	function getPrimaryLocale() {
		return pkp.context.primaryLocale;
	}

	/**
	 * Get the current locale of the application.
	 *
	 * @returns {string} The current locale code (e.g., 'en').
	 */
	function getCurrentLocale() {
		return pkp.context.currentLocale;
	}

	/**
	 * Get the help URL for the current application.
	 *
	 * @returns {string} The URL to the help documentation.
	 */
	function getHelpUrl() {
		return pkp.context.helpUrl;
	}

	/**
	 * Get the maximum nesting depth for navigation menu items.
	 *
	 * @returns {number} The maximum depth (default: 2).
	 */
	function getNavigationMenuMaxDepth() {
		return pkp.context.navigationMenuMaxDepth ?? 2;
	}

	const OJS_APP_STAGES = [
		{id: pkp.const.WORKFLOW_STAGE_ID_SUBMISSION, name: t('stage.submission')},
		{id: pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW, name: t('stage.review')},
		{id: pkp.const.WORKFLOW_STAGE_ID_EDITING, name: t('stage.copyediting')},
		{id: pkp.const.WORKFLOW_STAGE_ID_PRODUCTION, name: t('stage.production')},
	];

	const OMP_APP_STAGES = [
		{id: pkp.const.WORKFLOW_STAGE_ID_SUBMISSION, name: t('stage.submission')},
		{
			id: pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW,
			name: t('stage.review.internal'),
		},
		{
			id: pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
			name: t('stage.review.external'),
		},
		{id: pkp.const.WORKFLOW_STAGE_ID_EDITING, name: t('stage.copyediting')},
		{id: pkp.const.WORKFLOW_STAGE_ID_PRODUCTION, name: t('stage.production')},
	];

	const OPS_APP_STAGES = [
		{id: pkp.const.WORKFLOW_STAGE_ID_PRODUCTION, name: t('stage.production')},
	];

	function getAppStages() {
		if (isOJS()) {
			return OJS_APP_STAGES;
		} else if (isOMP()) {
			return OMP_APP_STAGES;
		} else if (isOPS()) {
			return OPS_APP_STAGES;
		}
		return [];
	}

	return {
		isOJS,
		isOMP,
		isOPS,
		getSupportedLocales,
		getSupportedFormLocales,
		getCurrentLocale,
		getPrimaryLocale,
		getHelpUrl,
		getNavigationMenuMaxDepth,
		getAppStages,
	};
}
