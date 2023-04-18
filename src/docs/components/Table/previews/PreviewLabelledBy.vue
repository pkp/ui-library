<template>
	<div class="previewTable">
		<h1 id="example-table-label">Example Using labelledBy and describedBy</h1>
		<p id="example-table-description">
			Use the labelledBy and describedBy props to label the table with other
			HTML elements. See the Labelling section in the usage guidance below.
		</p>
		<pkp-table
			aria-labelledby="example-table-label"
			aria-describedby="example-table-description"
		>
			<template slot="head">
				<table-header>ID</table-header>
				<table-header>Title</table-header>
				<table-header>Views</table-header>
				<table-header>Downloads</table-header>
				<table-header>Total</table-header>
			</template>
			<tr v-for="row in rows" :key="row.object.id">
				<table-cell>{{ row.object.id }}</table-cell>
				<table-cell :isRowHeader="true">
					{{ row.object.fullTitle.en }}
				</table-cell>
				<table-cell>{{ row.views }}</table-cell>
				<table-cell>{{ row.downloads }}</table-cell>
				<table-cell>
					<button @click="open(row)">{{ row.total }}</button>
				</table-cell>
			</tr>
		</pkp-table>
	</div>
</template>

<script>
import PreviewTable from './PreviewTable.vue';

export default {
	extends: PreviewTable,
};
</script>
