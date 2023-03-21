## Props

| Key | Description |
| --- | --- |
| `stacked` | Whether or not the header should appear above the panel content. Default: `false` |

## Events

This component does not emit any events.

## Usage

Use the `<Panel>` and `<PanelSection>` components to organize information visually. The `header` slot should be used to describe the information, input fields, or actions that can be taken in each `<PanelSection>`.

Usually, the `header` should use a `<h*>` element to help assistive technology navigate the document. Any `<h*>` level can be used without changing the size of the text.
