<template>
    <div class="new" id="new">
        <h2>Create new records</h2>

        <button type="button">
            <router-link to="/new/database">Database</router-link>
        </button>

        <button type="button">
            <router-link to="/new/standard">Standard</router-link>
        </button>

        <button type="button">
            <router-link to="/new/policy">Policy</router-link>
        </button>

        <button type="button">
            <router-link to="/new/collection">Collection</router-link>
        </button>
    </div>
</template>

<script>
    export default {
        name: "New"
    }
</script>

<style scoped>

</style>