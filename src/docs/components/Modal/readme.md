## Props

| Key | Description |
| --- | --- |
| `closeLabel` | The accessible text on the modal's close icon (×). Required |
| `name` | A unique name for this modal. This is used to open and close the modal. |
| `title` | The title to display at the top of the modal. This is optional but should be used in most cases. |

## Events

| Key | Description |
| --- | --- |
| `closed` | When the modal is closed. The payload is passed from the [vue-js-modal](https://github.com/euvl/vue-js-modal) library. See the [Focus](#focus) section below. |

## Global Events

This component does not emit any global events.

## Usage

This library uses the [vue-js-modal](https://github.com/euvl/vue-js-modal) component to control modals and dialogs. Import the `Modal` component and use it like this.

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
			cancelLabel: 'Cancel',
			confirmLabel: 'Confirm',
			message: 'Are you sure you want to submit this article?',
			name: 'dialog',
			title: 'Submit Article',
			callback: () => {
				// user has confirmed
			},
			closeCallback: () => {
				// user has cancelled
			}
		});
	}
}
```

### Dialog Props

| Key | Description |
| --- | --- |
| `cancelLabel` | A localized label for the cancel button. |
| `confirmLabel` | A localized label for the confirm button. |
| `message` | The message to display in the dialog. |
| `name` | A unique name for this dialog. |
| `title` | The title to display in the dialog. |
| `callback` | A callback function to call when the user clicks the confirm button. |
| `closeCallback` | A callback function to call when the user closes the modal. |

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