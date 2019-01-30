# Elements

Elements are composed of HTML and can be written into any component.

## Spinner

<div class="pkpul-element">
	<div class="pkpul-element__preview">
		<span class="pkpSpinner" aria-hidden="true"></span>
	</div>
```
<span class="pkpSpinner" aria-hidden="true"></span>
```
</div>

Use the spinner to indicate when a request is pending, a component is loading or the user must wait for some activity to complete.

## Table

<div class="pkpul-element">
	<div class="pkpul-element__preview">
		<table class="pkpTable">
			<caption>
				<div class="pkpTable__label">Example</div>
				<div class="pkpTable__description">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</div>
			</caption>
			<thead>
				<tr>
					<th scope="col">Name</th>
					<th scope="col">Age</th>
				</tr>
			</thead>
			<tbody>
				<tr class="pkpTable__row">
					<th scope="row">Adnan</th>
					<td>22</td>
				</tr>
				<tr class="pkpTable__row">
					<th scope="row">Lina</th>
					<td>23</td>
				</tr>
			</tbody>
		</table>
	</div>
```
<table class="pkpTable">
	<caption>
		<div class="pkpTable__label">Example</div>
		<div class="pkpTable__description">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</div>
	</caption>
	<thead>
		<tr>
			<th scope="col">Name</th>
			<th scope="col">Age</th>
		</tr>
	</thead>
	<tbody>
		<tr class="pkpTable__row">
			<th scope="row">Adnan</th>
			<td>22</td>
		</tr>
		<tr class="pkpTable__row">
			<th scope="row">Lina</th>
			<td>23</td>
		</tr>
	</tbody>
</table>
```
</div>

Use the table to show tabular information that the user will read.

**Do not use the table** when the user must interact with the data in the table, such as sorting, searching, filtering or editing the rows. Use the [Table component](#/components/Table) in these cases.

When using a table, be sure to provide a `<caption>` or use the `aria-labelledby` attribute to provide a separate label.

Apply the `scope` attribute to columns. In each row, add the `scope` attribute and use the `<th>` element for the cell that best describes each row.
