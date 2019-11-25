<template>
    <h2>This will be the community page</h2>
</template>

<script>
    export default {
        name: "Community",
        methods: {
            greet: function (event) {
                alert('Hello ' + this.name + '!');
                alert(event.target.tagName)
            }
        }
    }
</script>

<style scoped>

</style>