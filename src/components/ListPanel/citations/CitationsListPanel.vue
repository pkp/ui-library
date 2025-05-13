

<script setup>
import {useLocalize} from '@/composables/useLocalize';
import TableHeader from '@/components/Table/TableHeader.vue';
import Button from '@/components/Button/Button.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableBody from '@/components/Table/TableBody.vue';
import PkpTable from '@/components/Table/Table.vue';
import TableRow from '@/components/Table/TableRow.vue';
import {ref, useId} from 'vue';

defineProps({
	publication: {type: Object, required: true},
});


</script>
