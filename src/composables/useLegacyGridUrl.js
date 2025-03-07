import {ref, computed} from 'vue';
import {useModal} from '@/composables/useModal';

function camelCaseToDashes(str) {
	return str.replace(/([a-z]+)([A-Z])/g, '$1-$2').toLowerCase();
}
export function useLegacyGridUrl({
	component: _component,
	op: _op,
	params: _params,
} = {}) {
	if (typeof pkp === 'undefined' || !pkp?.context?.legacyGridBaseUrl) {
		throw new Error('pkp.context.legacyGridBaseUrl is not configured');
	}

	const component = ref(_component);
	const op = ref(_op);
	const params = ref(_params);

	const queryParamsString = computed(() => {
		if (params.value && Object.keys(params.value).length) {
			return `?${new URLSearchParams(params.value).toString()}`;
		}
		return '';
	});

	const url = computed(() => {
		let componentPath = component.value.slice(0, -7);
		componentPath = camelCaseToDashes(componentPath.split('.').join('/'));
		const opPath = camelCaseToDashes(op.value);

		let baseUrl = pkp.context.legacyGridBaseUrl
			.replace('component', componentPath)
			.replace('action', opPath);
		return `${baseUrl}${queryParamsString.value}`;
	});

	function openLegacyModal(
		{title, closeOnFormSuccessId, description},
		finishedCallback,
	) {
		const {openSideModal} = useModal();

		openSideModal(
			'LegacyAjax',
			{
				legacyOptions: {
					title,
					url,
					closeOnFormSuccessId,
					description,
				},
			},
			{
				onClose: async (closeData) => {
					finishedCallback(closeData);
				},
			},
		);
	}

	return {url, openLegacyModal};
}
