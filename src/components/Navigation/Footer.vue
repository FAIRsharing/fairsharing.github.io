<template>
    <nav class="footer navbar navbar-expand-lg navbar-dark navbar-transparent">
        This will be the footer

        <div class="linkToStatic">
            <ul>
                <li><router-link to="/">Community</router-link></li>
                <li><router-link to="/">Stakeholders</router-link></li>
                <li><router-link to="/">Timeline</router-link></li>
                <li><router-link to="/">API & License</router-link></li>
                <li><router-link to="/">Terms of use</router-link></li>
                <li><router-link to="/">How to cite us</router-link></li>
                <li><router-link to="/">Privacy Policy</router-link></li>
            </ul>
        </div>
    </nav>
</template>

<script>
    export default {
        name: "Footer"
    }
</script>

<style scoped>
    nav {
        position: absolute;
        bottom:0;
        border-top:1px solid #ccc;
        width: 100%;
    }
</style>