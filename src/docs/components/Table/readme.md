## Props

This component does not accept any props.

## Events

This component does not emit any events.

## Usage

Use the `Table` component to display tabular data when the user will sort, search, filter or edit the rows in the table, or if interactive elements such as a button appear within the table.

## Datagrid

This component implements a [Data Grid](https://www.w3.org/TR/wai-aria-practices/examples/grid/dataGrids.html), which provides accessible keyboard controls and markup for managing the data in the table. All interactions in the table rows, including buttons or fields to edit a row, must be accessible by keyboard.

## &lt;TableCell&gt;

All cells in the table must use the `<TableCell>` component in order to support the accessible keyboard navigation features. Use a `<TableCell>` inside of a `<tr>` in the same way that a `<td>` element would be used.

```html
<pkp-table>
    <tr>
        <table-cell :isRowHeader="true">dbarnes</table-cell>
        <table-cell >Daniel Barnes</table-cell>
    </tr>
    <tr>
        <table-cell :isRowHeader="true">sminotue</table-cell>
        <table-cell >Stephanie Minotue</table-cell>
    </tr>
</pkp-table>
```

When writing a `<TableCell>` in a Smarty template, you must use a `<td>` with with the `is` attribute.

```html
<pkp-table>
    <tr>
        <td is="table-cell" :isRowHeader="true">dbarnes</td>
        <td is="table-cell" >Daniel Barnes</td>
    </tr>
    <tr>
        <td is="table-cell" :isRowHeader="true">sminotue</td>
        <td is="table-cell" >Stephanie Minotue</td>
    </tr>
</pkp-table>
```

This is because templates written in Smarty are parsed by the browser before they are parsed by Vue. Learn more about Vue's [DOM Template Parsing Caveats](https://v2.vuejs.org/v2/guide/components.html#DOM-Template-Parsing-Caveats).

### Props

| Name | Description |
| --- | --- |
| `isRowHeader` | Set this to `true` on the cell that best describes the data in the row. For example, if the row contains information about an object, specify the cell with the object's name or title as the row header. Only one cell in each row should be designated a row header. A row header will apply [&lt;th scope="row"&gt;](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th#scope). Default: `false` |

### Events

This component does not emit any events.

## &lt;TableHeader&gt;

The `<TableHeader>` component should be used in the table's `head` slot to display column headers.

```html
<pkp-table>
    <template slot="head">
        <table-header>Username</table-header>
        <table-header>Name</table-header>
    </template>
</pkp-table>
```

### Props

| Name | Description |
| --- | --- |
| `canSort` | Whether or not the table can be sorted by this column. |
| `sortDirection` | One of the [aria-sort](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-sort) properties. A table can only be sorted by one column at a time. If the table is not sorted by this column, the value should be `none`. Default: `none` |

### Events

| Name | Description |
| --- | --- |
| `table:sort` | Triggered when the user clicks the column header in order to sort by it. |

## Sorting

When a table can be sorted, you must [announce the changes](#/pages/announcer). When a sort is performed by making a request to the server, announce at both the start and end of the process.

```js
methods: {
    sort(col) {
        this.$announcer.set('Loading');
        $.ajax({

            // ...

            success(r) {

                // ...

                this.$announcer.set('Sorted by ' + col);
            }
        });
    }
}
```

## Accessible Caption

Every table needs an accessible caption. Use the `caption` slot to provide a title with the correct `<h*>` heading according to the page hierarchy. The description is optional.

```html
<pkp-table>
    <pkp-header slot="caption">
        <h2>Example Table</h2>
    </pkp-header>
</pkp-table>
```

If you do not use the `caption` slot, you must use the `labelledBy` prop to provide an accessible label for the table. See the [Labelled By](#/component/Table/with-labelledby) example.
