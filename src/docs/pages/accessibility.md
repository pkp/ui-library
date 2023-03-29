# Accessibility

All components in the library are written to be accessible to everyone, regardless of whether that person is using a mouse and keyboard, a touch device, or assistive technology like a screen reader. Sometimes, when using a component, it is important to know how to use it correctly to take advantage of its accessibility support. The demo page for each component will include accessibility guidance where appropriate. However, some things are important to know when working with any component.

## Navigate by keyboard

It should be possible to use a component without a mouse or touch device. To test this, use the <kbd>TAB</kbd> key to interact with the component and check the following:

- Can I use all features of the component with the keyboard? For example, if the component allows the user to reorder items, can I do this with a keyboard?
- Can I see where the focus is at all times? Is it easy to see where it moves each time I hit the <kbd>TAB</kbd> key? Does the focus ever "disappear" from the page, so that I don't know where it is?

## Don't switch focus (usually)

Avoid moving the focus from one element to another in the code. This can be disorienting and frustrating for users who rely on keyboard navigation. We make an exception when the user performs an action that can be interpreted as a request to move focus. For example, when a button is pressed to open a modal, the focus should be moved into that modal and kept there until the modal is closed. When closed, the focus should be moved to the element which opened the modal. The [Modal](#/component/Modal) component will automatically "take" the focus when it is opened. But guidance in the component demo should be followed to handle focus when it is closed.

Another common example is when an action deletes an item on the page. If the focus is on a delete button when that button is removed, the focus will be dropped to the window. The user will be forced to navigate again all the way to the part of the page they were at before. In such cases, it is often best to reset the focus to a reasonable nearby element. For example, move the focus to a previous item in a list or the title of the section where the item was removed.

## Don't use tabindex

Avoid using the `tabindex` attribute to change the tab order. This is disorienting for users accustomed to navigating by keyboard. An exception can be made when you need to use `tabindex="-1"` to prevent an item from receiving focus. You may wish to do this to remove drag-and-drop controls from a keyboard user's tab order, or to prevent the user from having to tab through elements which are currently hidden. Otherwise, never try to set the tab order using `tabindex`.

## Use labels for screen readers

When a component uses icons or a visual layout to indicate the meaning of something, you must provide a text label for users without sight. Use the `-screenReader` class to add a label for screen readers that can't be seen on the screen. Never use `display: hidden`. Screen readers will ignore the text.

For example, a search field often uses an icon of a magnifying glass to provide a hint that it is a search field, along with the `placeholder` attribute. However, a `placeholder` attribute can not be read by all screen readers. Provide a text `<label>` that is visually hidden.

<div class="inlinePreview inlinePreview--accessibleSearch">
	<span class="fa fa-search" aria-hidden="true"></span>
	<input id="searchInput" placeholder="Search submissions">
	<label for="searchInput" class="-screenReader">
		Search submissions
	</label>
</div>

```html
<icon icon="search" />
<input id="searchInput" placeholder="Search submissions">
<label for="searchInput" class="-screenReader">
	Search submissions
</label>
```

An icon may not need a text label for sighted users to understand it's purpose. For example, when a ✘ icon appears to remove an item. In such cases, a hidden text label must be provided that indicates the action and which item the action relates to.

<div class="inlinePreview inlinePreview--accessibleButton">
	<div>
		My example submission
		<button>
			<span class="fa fa-times" aria-hidden="true"></span>
			<span class="-screenReader">Delete My example submission</span>
		</button>
	</div>
</div>

```html
<li>
	My example submission
	<button @click="deleteSubmission">
		<icon icon="times" />
		<span class="-screenReader">Delete My example submission</span>
	</button>
</li>
```

Learn more about how to work with the [REST API](#/pages/api).