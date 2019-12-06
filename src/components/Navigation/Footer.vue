<template>
    <nav class="footer navbar navbar-expand-lg navbar-dark navbar-transparent">

        <div class="linkToStatic">
            <ul>
                <li><router-link to="/community">Community</router-link></li>
                <li><router-link to="/stakeholders">Stakeholders</router-link></li>
                <li><router-link to="/timeline">Timeline</router-link></li>
                <li><router-link to="/license">API & License</router-link></li>
                <li><router-link to="/terms">Terms of use</router-link></li>

                <li>
                    <router-link to="/educational#faq10-1">
                        How to cite us
                    </router-link>
                </li>

                <li><router-link to="/privacy">Privacy Policy</router-link></li>
            </ul>
        </div>
    </nav>
</template>

<script>
/** Component to handle the footer (should be present on every page)
 * @vue-data {String} someLinks - just a test
*/
    export default {
        name: "Footer",
        components: {
        },
        data: function(){
            return {
                someLinks: "pouet"
            }
        }
    }
</script>

<style scoped>
    nav {
        position: absolute;
        bottom:0;
        border-top:1px solid #ccc;
        width: 100%;
    }
    ul {
        list-style: none;
        padding:0;
        margin-left:20px;
    }
     ul li {
         text-align: left;
     }

</style>