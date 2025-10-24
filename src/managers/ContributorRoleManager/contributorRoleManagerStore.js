import {ref} from 'vue';
import {defineComponentStore} from '@/utils/defineComponentStore';
import {useModal} from '@/composables/useModal';
import ContributorRoleDeleteDialogBody from '@/managers/ContributorRoleManager/ContributorRoleDeleteDialogBody.vue';
import {useLocalize} from '@/composables/useLocalize';
import {useUrl} from '@/composables/useUrl';
import {useFetch} from '@/composables/useFetch';
import EditcontributorRoleFormModal from '@/managers/ContributorRoleManager/EditContributorRoleFormModal.vue';
import {useContributorRoleManagerAddRole} from '@/managers/ContributorRoleManager/useContributorRoleManagerFormAddRole.js';
import {useForm} from '@/composables/useForm';
import {cloneDeep} from 'lodash';

export const Actions = {
	EDIT: 'roleEdit',
	ADD: 'roleAdd',
	DELETE: 'roleDelete',
};
const {t} = useLocalize();
export const useContributorRoleManagerStore = defineComponentStore(
	'contributorRoleManagerStore',
	(props) => {
		// Fetch selected roles
		const {apiUrl: rolesApiUrl} = useUrl('contributorRoles');
		const {data: roles, fetch: fetchContributorRoles} = useFetch(rolesApiUrl, {
			method: 'GET',
		});
		fetchContributorRoles();

		// Add/edit form
		const {apiUrl: contributorRoleFormDataApiUrl} = useUrl(
			'contributorRoles/contributorRoleFormData',
		);
		const {data: contributorRoleFormData, fetch: fetchContributorRoleFormData} =
			useFetch(contributorRoleFormDataApiUrl, {
				method: 'GET',
			});
		let resetContributorRoleForm = null;
		const contributorRoleForm = ref(null);
		setContributorRoleForm();

		/**
		 * Fetch form data and set form
		 */
		async function setContributorRoleForm() {
			await fetchContributorRoleFormData();
			const {form, resetForm} = useContributorRoleManagerAddRole({
				rolesApiUrl,
				contributorRoleFormData,
			});
			resetContributorRoleForm = resetForm;
			contributorRoleForm.value = form.value;
		}

		/**
		 * Get the form data for adding or editing a role.
		 * @param {string} action - Action being performed. One of Actions.ADD or Actions.EDIT.
		 * @param {Object|null} role - The role object.
		 * @return {Object} - The role form.
		 */
		function getContributorRoleForm(action, role) {
			// Get a deep copy of the form to eliminate references
			const preparedForm = cloneDeep(contributorRoleForm.value);
			const {getField, setValues, setAction, setMethod} = useForm(preparedForm);

			role = role || {};

			// return empty form if adding a new
			if (action === Actions.ADD) {
				return preparedForm;
			}

			// Prepare form for editing
			if (role.id && action === Actions.EDIT) {
				// Disallow edit of identifier
				const fieldIdentifier = getField('identifier');
				fieldIdentifier.options = [
					{value: role.identifier, label: role.identifier},
				];

				setValues({
					...role,
				});
				setMethod('PUT');
				setAction(`${preparedForm.action}/${role.id}`);
			}

			return preparedForm;
		}

		/***
		 * Deletes a role.
		 * @param {Object} role
		 */
		function roleDelete(role) {
			const {openDialog} = useModal();
			const {apiUrl} = useUrl(`contributorRoles/${role.id}`);
			const {fetch: fetchDelete, isSuccess} = useFetch(apiUrl, {
				method: 'DELETE',
			});

			openDialog({
				bodyComponent: ContributorRoleDeleteDialogBody,
				bodyProps: {
					onConfirm: async () => {
						await fetchDelete();

						if (isSuccess.value) {
							openContributorRoleDeleteDialog(role.identifier);
							await fetchContributorRoles();
							await fetchContributorRoleFormData();
							await resetContributorRoleForm?.();
						}
					},
					identifier: role.identifier,
				},
				title: t('manager.contributorRoles.alert.delete.confirmationTitle', {
					identifier: role.identifier,
				}),
				modalStyle: 'negative',
			});
		}

		/**
		 * Open a dialog indicating that the role was deleted.
		 */
		function openContributorRoleDeleteDialog(identifier) {
			const {openDialog} = useModal();

			openDialog({
				title: t('manager.contributorRoles.alert.deleted'),
				message: t('manager.contributorRoles.alert.deleted.description', {
					identifier: identifier,
				}),

				actions: [
					{
						label: t('manager.contributorRoles.backToRoles'),
						callback: (close) => close(),
					},
				],
				modalStyle: 'primary',
			});
		}

		/**
		 * Open the form modal to add/edit role.
		 * @param {string} title - The title to display in the modal.
		 * @param {Object} form - The role form object to display in the modal.
		 */
		function openContributorRoleFormModal(title, form) {
			const {openSideModal} = useModal();
			openSideModal(EditcontributorRoleFormModal, {
				title,
				formProps: form,
				onSuccess: async () => {
					await roleSaved();
				},
			});
		}

		/**
		 * Function to execute when a role is successfully saved via form.
		 */
		async function roleSaved() {
			pkp.eventBus.$emit(
				'notify',
				t('manager.contributorRoles.saved'),
				'success',
			);
			closeContributorRoleFormModal();
			await fetchContributorRoles();
			await fetchContributorRoleFormData();
			await resetContributorRoleForm?.();
		}

		/**
		 * Close the currently opened role form modal.
		 */
		function closeContributorRoleFormModal() {
			const {closeSideModal} = useModal();
			closeSideModal(EditcontributorRoleFormModal);
		}

		/**
		 * Edit a role.
		 * @param {Object} role
		 */
		function roleEdit(role) {
			openContributorRoleFormModal(
				t('manager.contributorRoles.edit'),
				getContributorRoleForm(Actions.EDIT, role),
			);
		}

		/**
		 * Add a new role.
		 */
		function roleAdd() {
			openContributorRoleFormModal(
				t('manager.contributorRoles.add'),
				getContributorRoleForm(Actions.ADD, null),
			);
		}

		/**
		 * Get the actions available for a role item.
		 * @return {Array<{ label: string, icon: string, name: string, isWarnable?: boolean}>} - The list of actions available.
		 */
		function getItemActions() {
			const actions = [
				{
					label: t('common.edit'),
					icon: 'Edit',
					name: Actions.EDIT,
				},
				{
					label: t('manager.contributorRoles.delete.role'),
					icon: 'Cancel',
					name: Actions.DELETE,
					isWarnable: true,
				},
			];

			return actions;
		}

		return {
			getItemActions,
			roleEdit,
			roleAdd,
			roleDelete,
			roles,
		};
	},
);
