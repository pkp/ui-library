import {http, HttpResponse} from 'msw';
import {within, userEvent} from 'storybook/test';
import FormModal from './FormModal.vue';
import {useModal} from '@/composables/useModal.js';
import cloneDeep from 'clone-deep';
import FormMock from '@/components/Form/mocks/form-base';

const formApiUrl = 'https://mock/index.php/publicknowledge/api/v1/formModal';

export default {
	title: 'Components/FormModal',
	component: FormModal,
};

export const Base = {
	render: (args) => ({
		setup() {
			const {openSideModal} = useModal();
			function openModal() {
				const formConfig = cloneDeep(FormMock);
				formConfig.action = formApiUrl;
				openSideModal(FormModal, {
					title: 'Plugin Settings',
					formConfig,
					getApiUrl: formApiUrl,
				});
			}
			return {openModal};
		},
		template: '<PkpButton @click="openModal">Open Modal</PkpButton>',
	}),
	decorators: [() => ({template: '<div style="height: 600px"><story/></div>'})],
	args: {},
	play: async ({canvasElement}) => {
		const canvas = within(canvasElement);
		const user = userEvent.setup();
		await user.click(canvas.getByText('Open Modal'));
	},
	parameters: {
		msw: {
			handlers: [
				http.get(formApiUrl, async () => {
					return HttpResponse.json({
						'given-name': 'John',
						'family-name': 'Doe',
						email: 'john.doe@example.org',
						'mailing-address': '123 Main St, City',
					});
				}),
				http.put(formApiUrl, async ({request}) => {
					const body = await request.json();
					return HttpResponse.json(body);
				}),
			],
		},
	},
};
