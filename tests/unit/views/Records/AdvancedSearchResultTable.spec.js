import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import advancedSearch from "@/store/advancedSearch";
import AdvancedSearchResultTable from "@/views/Records/AdvancedSearchResultTable.vue";

let $route = {
  name: "search",
  query: {},
};

const $router = {
  push: jest.fn(),
};

describe("AdvancedSearchResultTable.vue", function () {
  let wrapper, store;
  const vuetify = new Vuetify();
  const localVue = createLocalVue();
  localVue.use(Vuex);

  beforeEach(() => {
    advancedSearch.getters = {
      getLoadingStatus: () => {
        return [true];
      },
      getAdvancedSearchResponse: () => {
        return [
          {
            id: 2740,
            type: "repository",
            name: "Genome-Wide Association Studies Catalog",
            description:
              "The Genome-Wide Association Studies (GWAS) Catalog provides a consistent, searchable, visualisable and freely available database of published SNP-trait associations, which can be easily integrated with other resources, and is accessed by scientists, clinicians and other users worldwide. Within the Catalog, all eligible GWA studies are identified by literature search and assessed by curators, who then extract the reported trait, significant SNP-trait associations, and sample metadata. The Catalog also publishes a GWAS diagram of SNP-trait associations, mapped onto the human genome by chromosomal location and displayed on the human karyotype. Since 2010, delivery and development of the Catalog has been a collaborative project between the EMBL-EBI and NHGRI.",
            registry: "Database",
            status: "ready",
            subjects: [
              {
                label: "Genomics",
                id: 541,
                definitions: [
                  "The study of comprehensive sets of genes via high throughput methods.",
                ],
                iri: "http://purl.obolibrary.org/obo/NCIT_C84343",
                synonyms: [],
              },
              {
                label: "Comparative Genomics",
                id: 783,
                definitions: [
                  "The study (typically comparison) of the sequence, structure or function of multiple genomes.",
                ],
                iri: "http://edamontology.org/topic_0797",
                synonyms: [],
              },
            ],
            domains: [
              {
                label: "Single nucleotide polymorphism",
                id: 1798,
                definitions: [
                  "SNPs are single base pair positions in genomic DNA at which different sequence alternatives exist in normal individuals in some population(s), wherein the least frequent variant has an abundance of 1% or greater.",
                ],
                iri: "http://purl.obolibrary.org/obo/SO_0000694",
                synonyms: ["SNP"],
                inFairsharing: true,
              },
              {
                label: "Genome-wide association study",
                id: 1853,
                definitions: [
                  "Genome wide association study is a kind of study whose objective is to detect association between genetic markers (SNP or otherwise) accross the genome and a trait which may be a disease or another phenotype (e.g. trait of agronomic relevance in animal or plant studies). Genome wide association study compare the allele frequencies in 2 populations, one free of the trait used as control, the other one showing the trait use as 'case'. GWAS studies implement case-control design",
                ],
                iri: "http://purl.obolibrary.org/obo/STATO_0000091",
                synonyms: ["whole genome association study", "", "GWAS study"],
                inFairsharing: true,
              },
            ],
            taxonomies: [
              {
                id: 453,
                label: "Homo sapiens",
              },
            ],
          },
        ];
      },
    };

    store = new Vuex.Store({
      modules: {
        namespaced: true,
        advancedSearch: advancedSearch,
      },
    });

    wrapper = shallowMount(AdvancedSearchResultTable, {
      localVue,
      vuetify,
      store,
      mocks: { $route, $router },
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("AdvancedSearchResultTable");
  });
});
