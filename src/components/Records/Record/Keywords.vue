<template>
    <v-card
            class="pa-4 mt-3 mt-lg-2 d-flex flex-column"
            outlined
            tile
            elevation="1"
    >
        <SectionTitle title="keywords"/>
        <section>
            <!--Taxonomies-->
            <div class="d-flex mt-4 flex-wrap">
                <b class="mr-2">Taxonomies:</b>
                <v-chip
                        v-for="item in taxonomies"
                        :key="item.label"
                        class="mr-2 mb-2 "
                        color="primary"
                        label
                        outlined
                        text-color="primary"
                >
                    <v-icon left>
                        mdi-label
                    </v-icon>
                    {{ item.label }}
                </v-chip>
            </div>
            <!--Domains-->
            <div
                    class="d-flex mt-2 flex-wrap"
            >
                <b class="mr-8">Domains:</b>
                <v-chip
                        v-for="item in domains"
                        :key="item.label"
                        class="mr-2 mb-2"
                        color="secondary"
                        label
                        outlined
                        text-color="secondary"
                >
                    <v-icon left>
                        mdi-label
                    </v-icon>
                    {{ item.label }}
                </v-chip>
            </div>
            <!--Subjects-->
            <div
                    class="d-flex mt-2 flex-wrap"
            >
                <b class="mr-8">Subjects:</b>
                <v-chip
                        v-for="item in subjects"
                        :key="item.label"
                        class="mr-2 mb-2"
                        color="accent"
                        label
                        outlined
                        text-color="accent"
                >
                    <v-icon left>
                        mdi-label
                    </v-icon>
                    {{ item.label }}
                </v-chip>
            </div>
        </section>
    </v-card>
</template>

<script>
    import SectionTitle from '@/components/Records/Record/SectionTitle';

    export default {
        name: "Keywords",
        components: {
            SectionTitle
        },
        props: {
            taxonomies: {
                default: null,
                type: Array
            },
            domains: {
                default: null,
                type: Array
            },
            subjects: {
                default: null,
                type: Array
            }
            // TODO: Also needs user defined tags
        },
    }
</script>

<style scoped>

</style>