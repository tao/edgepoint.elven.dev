<template>
    <div class="container mx-auto py-16 grid gap-y-6">
        <HelloWorld msg="Edgepoint Importer" />
        <DropZone />
    </div>
</template>

<script>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import HelloWorld from './components/HelloWorld.vue'
import DropZone from './components/DropZone.vue'

export default {
    components: { HelloWorld, DropZone },
}
</script>
