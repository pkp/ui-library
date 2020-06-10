## Usage

This library uses the [vue-js-modal](https://github.com/euvl/vue-js-modal) component to control modals and dialogs. Add the `modal` mixin to use the `<modal>` and `<modal-content>` components.

```js
import modal from '@/mixins/modal';

export default {
	mixins: [modal]
};
```

## Dialog

Dialogs provide a simplified way to show a confirmation modal. Use the `openDialog` method to create a dialog.

```js
this.openDialog({
	cancelLabel: 'Cancel',
	confirmLabel: 'Confirm',
	message: 'Are you sure you want to submit this article?',
	modalName: 'dialog',
	title: 'Submit Article',
	callback: () => {
		// user has confirmed
	},
	closeCallback: () => {
		// user has cancelled
	}
});
```

### Dialog Props

| Key | Description |
| --- | --- |
| `cancelLabel` | A localized label for the cancel button. |
| `confirmLabel` | A localized label for the confirm button. |
| `message` | The message to display in the dialog. |
| `modalName` | A unique name for this dialog. |
| `title` | The title to display in the dialog. |
| `callback` | A callback function to call when the user clicks the confirm button. |
| `closeCallback` | A callback function to call when the user closes the modal. |

## Focus

When a modal is opened the focus will be moved into it. When it is closed the focus must be reset to the element it was on _before the modal was opened_.

Use a [$ref](https://vuejs.org/v2/guide/components-edge-cases.html#Accessing-Child-Component-Instances-amp-Child-Elements) to set focus back to the appropriate element.

```html
<template>
	<div>
		<pkp-button ref="button" @click="$modal.show('example')">
			Open Modal
		</pkp-button>
		<modal
			v-bind="MODAL_PROPS"
			name="example"
			@closed="setFocusToRef('button')"
		>
			<modal-content>
				...
			</modal-content>
		</modal>
	</div>
</template>
```

A dialog will reset the focus automatically.