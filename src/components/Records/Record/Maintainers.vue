<template>
    <v-card
            class="pa-4 mt-5 d-flex flex-column"
            outlined
            tile
            elevation="1"
    >
        <SectionTitle title="Maintainers"/>
        <!--Contact-->
        <v-card
                v-for="(maintainer, index) in maintainerData"
                :key="maintainer.contact_name"
                class="pa-4 d-flex flex-column"
                :class="index===0?'mt-4':'mt-2'"
                flat
                outlined
        >
            <div class="d-flex mt-2 flex-wrap">
                <v-icon
                        color="secondary"
                        class="mr-2"
                >
                    mdi-account-circle
                </v-icon>
                <b class="mr-2">User Name:</b>
                <a :href="maintainer.username + '/' + maintainer.id">
                    {{ maintainer.username + '/' + maintainer.id }}
                </a>
            </div>
        </v-card>
    </v-card>
</template>

<script>
    import SectionTitle from '@/components/Records/Record/SectionTitle';

    export default {
        name: "Maintainers",
        components: {
            SectionTitle
        },
        props: {
            maintainerData: {
                default: null,
                type: Array
            },
        },
    }
</script>

<style scoped>

</style>