<template>
    <table class="table">
        <thead>
            <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Subject</th>
                <th>...</th>
            </tr>
        </thead>


        <tbody>
            <tr>
                <td><router-link to="/ABA">ABA Adult Mouse Brain</router-link></td>
                <td>Standard</td>
                <td>Neuroscience</td>
                <td>...</td>
            </tr>
        </tbody>

    </table>
    
</template>

<script>
    /*
    * This will need to rely on the the output of another component that handles the http requests.
    * SearchOutputTable should build the table that can be reused.
    * */

    export default {
        name: "SearchOutputTable",
        props: ['input_data']
    }
</script>

<style scoped>

</style>