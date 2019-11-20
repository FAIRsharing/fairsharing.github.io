<template>
    <div class="outputTable">
        <h1>{{currentPath}}</h1>
        <output-table></output-table>
    </div>
</template>

<script>
    import OutputTable from './SearchOutputTable'

    export default {
        name: "Records",
        computed: {
            currentPath: function(){
                return this.$route.path.replace('/', '');
            }
        },
        components: {
            OutputTable
        }
    }
</script>

<style scoped>

</style>