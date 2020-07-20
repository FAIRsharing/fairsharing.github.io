<template>
    <v-card
            class="pa-4 mt-5 d-flex flex-column"
            outlined
            tile
            elevation="1"
    >

        <SectionTitle title="Support"/>
        <!-- SupportLinks -->
        <!-- TODO -->

        <!--Contact-->
        <v-card
                v-for="(contact, index) in getField('metadata')['contacts']"
                :key="contact.contact_name"
                class="pa-4 d-flex flex-column"
                :class="index === 0 ? 'mt-4':'mt-2'"
                flat
                outlined
        >
            <div class="d-flex mt-2 flex-wrap">
                <v-icon
                        color="secondary"
                        class="mr-2"
                >
                    mdi-account
                </v-icon>
                <b class="mr-2">Contact Name:</b>
                <p class="ma-0">
                    {{ contact.contact_name }}
                </p>
            </div>
            <div class="d-flex mt-2 flex-wrap">
                <v-icon
                        color="secondary"
                        class="mr-2"
                >
                    mdi-email
                </v-icon>
                <b class="mr-2">Contact Email:</b>
                <p class="ma-0">
                    {{ contact.contact_email }}
                </p>
            </div>
        </v-card>
    </v-card>
    
</template>

<script>
    import { mapGetters } from 'vuex';

    import SectionTitle from '@/components/Records/Record/SectionTitle';

    export default {
        name: "Support",
        components: {
            SectionTitle
        },
        computed: {
            ...mapGetters("record", ["getField"])
        }

    }
</script>

<style scoped>

</style>