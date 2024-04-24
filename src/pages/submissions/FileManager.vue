<template>{{ fileManagerStore.title }}</template>
<script setup>
import {useFileManagerStore} from './FileManagerStore.js';

const fileManagerStore = useFileManagerStore({});
</script>
