## Props

| Key | Description |
| --- | --- |
| `columns` | An array of configuration objects for each column. |
| `describedBy` | The id of one or more HTML elements that describe the table, to be used in an <code>aria-describedby</code> attribute. This prop is not required unless additional information about the table is available and not included in the <code>description</code> prop. |
| `description` | An optional description of the table. |
| `label` | A name for the table. If no <code>label</code> is provided, you must make use of the <code>labelledBy</code> prop. |
| `labelledBy` | The id of one or more HTML elements that name the table, to be used in an <code>aria-labelledby</code> attribute. This prop should not be used if a <code>label</code> is provided. |
| `orderBy` | The name of the column that the rows are ordered by. |
| `orderDirection` | The direction that rows are ordered by as a boolean. |
| `rows` | The items to display in the table. |

## Events

| Key | Description |
| --- | --- |
| `order-by` | Emitted when items in the table should be reordered. `(orderBy, orderDirection)` |

## Usage

Use the `Table` component to provide tabular data when the user will interact with the data, such as sorting, searching, filtering or editing the rows.

Do not use this component when the user will not interact with the table in these ways. You can write a `<table>` in plain HTML code for better performance. Use the class name, `pkpTable`, to apply consistent styles to your table.

## Datagrid

This component implements a [Data Grid](https://www.w3.org/TR/wai-aria-practices/examples/grid/dataGrids.html), which provides accessible keyboard controls and markup for managing the data in the table.

When using this component with a custom row slot, pay special attention to the use of `tabindex` and `scope="row"` to ensure your table cells remain compliant with the Data Grid spec.

All interactions in the table rows, including buttons or fields to edit a row, must be accessible by keyboard. Navigation with the up, down, left and right arrows should not be impacted by any interactive elements in a row.

If you extend this component with your own template, be sure to include accessible labeling. When appropriate, use the `scope` and `aria-sort` attributes in the header cells.

## External Labelling

You may wish to label the table with text that is not part of the table itself. In this case, the `labelledBy` prop must be used to link the table to its label. If you have an additional description, you must use the `describedBy` prop to link this description to the table.

See the [Labelled By](#/component/Table/LabelledBy) example.

## Slots

This component supports two kinds of slots for extending the template. Read the [Vue.js documentation about slots](https://vuejs.org/v2/guide/components-slots.html).

Examples of the slots in use can be seen in the [Custom Header](#/component/Table/examples/with-header) and [Custom Column](#/component/Table/examples/with-column) examples.
