import FieldShowEnsuringLink from './FieldShowEnsuringLink.vue';
import FieldBaseMock from '../mocks/field-base';
import FieldShowEnsuringLinkMock from '../mocks/field-show-ensuring-link';
import {useDialogStore} from '@/stores/dialogStore';
import PkpDialog from '@/components/Modal/Dialog.vue';

export default {
	title: 'Forms/FieldShowEnsuringLink',
	component: FieldShowEnsuringLink,
	render: (args) => ({
		components: {FieldShowEnsuringLink, PkpDialog},
		setup() {
			const dialogStore = useDialogStore();

			function change(name, prop, newValue, localeKey) {
				if (localeKey) {
					args[prop][localeKey] = newValue;
				} else {
					args[prop] = newValue;
				}
			}

			return {args, change, dialogStore};
		},
		template: `
			<PkpDialog
				:open="dialogStore.dialogOpened"
				v-bind="dialogStore.dialogProps"
				@close="dialogStore.closeDialog"
			></PkpDialog>

			<FieldShowEnsuringLink v-bind="args" @change="change" />
		`,
	}),
};

export const Base = {
	args: {...FieldBaseMock, ...FieldShowEnsuringLinkMock},
};
