## Usage

Dialogs provide a quick way to show a simple confirmation prompt. Import the `dialog` mixin and use the `openDialog()` method to create a dialog.

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
					label: 'Yes',
					isPrimary: true,
					callback: () => {
						// user has confirmed
					},
				},
				{
					label: 'No',
					isWarnable: true,
					callback: () => {
						// user has cancelled. close the modal
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

Dialogs use [vue-js-modal](https://github.com/euvl/vue-js-modal). Use the helper method to close a dialog by it's `name`.

```js
this.$modal.hide('example');
```

## openDialog()

The `openDialog()` method accepts a configuration object with the following parameters.

| Key | Description |
| --- | --- |
| `name` | A unique name for this dialog. |
| `title` | A localized title to display in the dialog. |
| `message` | A localized message to display in the dialog. |
| `close` | A callback function that will be fired when the dialog is closed. |
| `actions` | An array of buttons to add to the dialog. |
| `actions[0].label` | The label for the button. |
| `actions[0].callback` | A callback function that will be fired when the button is pressed. |
| `actions[0].isPrimary` | Whether to style this action as the primary or main action. See [Button](#/component/Button) |
| `actions[0].isWarnable` | Whether to style this action like a cancel, back or delete action. See [Button](#/component/Button) |
| `actions[0].element` | Pass `a` to make this a link instead of a button. See [Button](#/component/Button) |
| `actions[0].href` | The URL of a link when `element` is set to `a`. See [Button](#/component/Button) |
