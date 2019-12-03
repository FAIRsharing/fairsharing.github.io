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
    /** This component produces the output table based on the received data.
     * @vue-prop {Object} input_data - The input data coming from the API
     */
    export default {
        name: "SearchOutputTable",
        props: {
            input_data: {
                type: Object,
                default: function(){
                    return{}
                }
            }
        }
    }
</script>

<style scoped>

</style>