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

## Usage
TO BE UPDATED
This library uses the [vue-js-modal](https://github.com/euvl/vue-js-modal) component to control modals and dialogs. For a simple confirmation modal, see the [Dialog](#/mixins/dialog) component. For all other needs, use the `<Modal>` component by importing it and showing it like this.

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
