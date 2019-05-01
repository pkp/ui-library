# Accessibility

Some components require specific markup or special handling based on state to ensure that they are accessible. Component-specific guidelines are outlined within each component's Notes section. The following are broad accessibility guidelines which should be followed.

## Focus state and keyboard-based navigation

Always test by navigating components with a keyboard, using <kbd>TAB</kbd> to cycle through elements. Any HTML elements which are not visible should not receive focus. You should be able to see where the focus is on the page at any time.

For example, a [ListPanelFilter](#/component/ListPanel/ListPanelFilter) is hidden until enabled. When hidden, focusable elements such as the filter buttons should be skipped when navigating with the <kbd>TAB</kbd> key.

Furthermore, all actions should be possible without a mouse. If drag-and-drop features are used, there should be alternative tools for moving items around when only using a keyboard.

### Moving focus

As a general rule, you should *never* move the focus programmatically. This can be disorienting and frustrating for users who rely on keyboard navigation.

We make an exception for this when the user performs an action which indicates a particular focus is desired.

For example, when a button is pressed to open a modal, the focus should be moved into that modal and kept there until the modal is closed. When closed, the focus should be returned to the element which opened the modal.

### Avoid tabindex

Avoid using `tabindex="1"` and `tabindex="2"` to enforce the order of navigation. There are only two occassions when you should use `tabindex`:

1. Use `tabindex="-1"` to prevent an item from receiving focus. You may wish to do this to remove drag-and-drop controls from a keyboard user's tab order, or to prevent the user from having to tab through elements which are currently hidden.
2. Use `tabindex="0"` to allow an item to receive focus when it otherwise would not, such as a `<div>` or `<span>` element. This is useful when you want to move the focus to an element, and want to target a heading or label. (Generally, moving the focus should be avoided. See above.)

## Labelling for assistive technology

When a component uses icons or a visual layout to indicate the meaning of something, you must provide a text label for users without sight. You can use the `-screenReader` class to hide the label from sighted users but still expose it to screen readers.

You should _not_ use `display: hidden`, because screen readers will ignore the text.

### Hidden search label
A search field often uses an icon to indicate it's purpose. The `placeholder` attribute can not be read by all screen readers, so a label is provided and then hidden from sighted users.

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

### Icon-only buttons
In a few cases, an icon may not need a text label for sighted users to understand it's purpose. A hidden text label that indicates the action and which item the action relates to must be provided for those using screen readers.

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
