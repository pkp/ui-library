<template>
	<div class="previewTable">
		<h1 id="viewTableLabel">
			Example Using
			<code>labelledBy</code>
			and
			<code>describedBy</code>
		</h1>
		<p id="viewTableDescription">
			Use the
			<code>labelledBy</code>
			and
			<code>describedBy</code>
			props to label the table with other HTML elements. See the Labelling
			section in the usage guidance below.
		</p>
		<pkp-table
			labelledBy="viewTableLabel"
			describedBy="viewTableDescription"
			:columns="columns"
			:rows="rows"
		/>
	</div>
</template>

<script>
import PreviewTable from './PreviewTable.vue';

export default {
	extends: PreviewTable
};
</script>
