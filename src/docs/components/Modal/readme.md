## Props

| Key | Description |
| --- | --- |
| `closeLabel` | The accessible text on the modal's close icon (×). Required |
| `name` | A unique name for this modal. This is used to open and close the modal. |
| `title` | The title to display at the top of the modal. This is optional but should be used in most cases. |

## Events

| Key | Description |
| --- | --- |
| `closed` | When the modal is closed. The payload is passed from the [vue-js-modal](https://github.com/euvl/vue-js-modal) library. See the Focus section below. |

## Global Events

This component does not emit any global events.

## Usage

This library uses the [vue-js-modal](https://github.com/euvl/vue-js-modal) component to control modals and dialogs. For a simple confiration modal, see the [Dialog](#/component/Dialog) component.

Use the `Modal` component by importing it and showing it like this.

```js
import Modal from '@/components/Modal/Modal.vue';

export default {
	components: {
		Modal
	},
	methods: {
		openModal() {
			this.$modal.show('exampleModalName');
		}
	}
}
```

## Dialog

Dialogs provide an easy way to show a simple confirmation prompt. Import the `dialog` mixin and use the `openDialog` method to create a dialog.

```js
import dialog from '@/mixins/dialog';

export default {
	mixins: [dialog],
	methods: {
		this.openDialog({
			name: 'example',
			title: 'Submit Article',
			message: 'Are you sure you want to submit this article?',
			actions: [
				{
					label: 'Confirm',
					isPrimary: true,
					callback: () => {
						// user has confirmed
					},
				},
				{
					label: 'Cancel',
					isWarnable: true,
					callback: () => {
						// user has cancelled
						// usually you want to close the modal
						this.$modal.hide('example');
					}
				}
			],
			close: () => {
				// dialog has been closed
			}
		});
	}
}
```

### Dialog Props

| Key | Description |
| --- | --- |
| `name` | A unique name for this dialog. |
| `title` | The title to display in the dialog. |
| `message` | The message to display in the dialog. |
| `close` | A callback function that will be fired when the dialog is closed. |
| `actions` | The buttons to add to the dialog. |
| `actions[0].label` | The label for the button. |
| `actions[0].callback` | A callback function that will be fired when the button is pressed. |
| `actions[0].isPrimary` | Whether to style this action as the primary or main action. See [Button](#/component/Button) |
| `actions[0].isWarnable` | Whether to style this action like a cancel, back or delete action. See [Button](#/component/Button) |
| `actions[0].element` | Pass `a` to make this a link instead of a button. See [Button](#/component/Button) |
| `actions[0].href` | The URL of a link when `element` is set to `a`. See [Button](#/component/Button) |

## Focus

When a modal is opened the focus will be moved into it. When it is closed the focus must be reset to the element it was on _before the modal was opened_.

Use a [$ref](https://vuejs.org/v2/guide/components-edge-cases.html#Accessing-Child-Component-Instances-amp-Child-Elements) to set focus back to the appropriate element.

```html
<pkp-button ref="button" @click="$modal.show('example')">
	Open Modal
</pkp-button>
<modal
	v-bind="MODAL_PROPS"
	name="example"
	@closed="setFocusToRef('button')"
>
	...
</modal>
```

A dialog will reset the focus automatically.