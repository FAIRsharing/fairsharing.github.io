import {actions, mutations, getters, buildFacets} from "@/store/records.js"

describe('Mutation & Actions & Getters', () => {

    const returnedVal = {
        "aggregations": {
            "is_maintained": {
                "doc_count": 74,
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [
                    {
                        "key": "true",
                        "key_as_string": "true",
                        "doc_count": 47
                    },
                    {
                        "key": "false",
                        "key_as_string": "false",
                        "doc_count": 27
                    }
                ]
            },
            "grants": {
                "doc_count": 74,
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [
                    {
                        "key": "0225676",
                        "doc_count": 1
                    },
                    {
                        "key": "07.514.11.4003",
                        "doc_count": 1
                    },
                    {
                        "key": "16183mfds541",
                        "doc_count": 1
                    },
                    {
                        "key": "1u24ai117966-01",
                        "doc_count": 1
                    },
                    {
                        "key": "2014aa021502",
                        "doc_count": 1
                    },
                    {
                        "key": "208481",
                        "doc_count": 1
                    },
                    {
                        "key": "224495",
                        "doc_count": 1
                    },
                    {
                        "key": "2u41hg002273-13",
                        "doc_count": 1
                    },
                    {
                        "key": "31171271",
                        "doc_count": 1
                    },
                    {
                        "key": "5 u54 gm62114-06",
                        "doc_count": 1
                    },
                    {
                        "key": "50097",
                        "doc_count": 1
                    },
                    {
                        "key": "61075023",
                        "doc_count": 1
                    },
                    {
                        "key": "654008",
                        "doc_count": 1
                    },
                    {
                        "key": "676559",
                        "doc_count": 1
                    },
                    {
                        "key": "689868",
                        "doc_count": 1
                    },
                    {
                        "key": "ai40076",
                        "doc_count": 1
                    },
                    {
                        "key": "bb/k019783/1",
                        "doc_count": 1
                    },
                    {
                        "key": "bcs0096588",
                        "doc_count": 1
                    },
                    {
                        "key": "bcs0938633",
                        "doc_count": 1
                    },
                    {
                        "key": "c201012",
                        "doc_count": 1
                    },
                    {
                        "key": "ccf-0905536",
                        "doc_count": 1
                    },
                    {
                        "key": "ceitec - central european institute of technology [cz.1.05/1.1.00/02.0068]",
                        "doc_count": 1
                    },
                    {
                        "key": "dbi-0834043",
                        "doc_count": 1
                    },
                    {
                        "key": "dbi-1062520",
                        "doc_count": 1
                    },
                    {
                        "key": "dk097748",
                        "doc_count": 1
                    },
                    {
                        "key": "dk097771",
                        "doc_count": 1
                    },
                    {
                        "key": "fa8650-05-1-5041",
                        "doc_count": 1
                    },
                    {
                        "key": "fp7-health 305444",
                        "doc_count": 1
                    },
                    {
                        "key": "gm070064",
                        "doc_count": 1
                    },
                    {
                        "key": "gm078005-05",
                        "doc_count": 1
                    },
                    {
                        "key": "gm094585",
                        "doc_count": 1
                    },
                    {
                        "key": "hhsn266200400039c",
                        "doc_count": 1
                    },
                    {
                        "key": "hhsn272201200028c",
                        "doc_count": 1
                    },
                    {
                        "key": "hhsn275200800018c",
                        "doc_count": 1
                    },
                    {
                        "key": "jci-2010-9432",
                        "doc_count": 1
                    },
                    {
                        "key": "lhsg-ct-203-503265",
                        "doc_count": 1
                    },
                    {
                        "key": "mira r35 award",
                        "doc_count": 1
                    },
                    {
                        "key": "nn",
                        "doc_count": 1
                    },
                    {
                        "key": "ns080145",
                        "doc_count": 1
                    },
                    {
                        "key": "pi12/00624",
                        "doc_count": 1
                    },
                    {
                        "key": "r01ai081062",
                        "doc_count": 1
                    },
                    {
                        "key": "r35gm119771",
                        "doc_count": 1
                    },
                    {
                        "key": "rc2 lm010994",
                        "doc_count": 1
                    },
                    {
                        "key": "rkos pp002-68733/1",
                        "doc_count": 1
                    },
                    {
                        "key": "sfb646",
                        "doc_count": 1
                    },
                    {
                        "key": "t15 lm07056",
                        "doc_count": 1
                    },
                    {
                        "key": "u01 gm094612",
                        "doc_count": 1
                    },
                    {
                        "key": "u54 ca119367",
                        "doc_count": 1
                    },
                    {
                        "key": "u54 gm094618",
                        "doc_count": 1
                    },
                    {
                        "key": "u54 hg004028",
                        "doc_count": 1
                    },
                    {
                        "key": "u54-hg004028",
                        "doc_count": 1
                    },
                    {
                        "key": "wt085822ma",
                        "doc_count": 1
                    },
                    {
                        "key": "ycstc, 2016nc5021",
                        "doc_count": 1
                    }
                ]
            },
            "fairsharing_registry": {
                "doc_count": 74,
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [
                    {
                        "key": "standard",
                        "doc_count": 74
                    }
                ]
            },
            "subjects": {
                "doc_count": 74,
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [
                    {
                        "key": "natural science",
                        "doc_count": 65
                    },
                    {
                        "key": "natural sciences",
                        "doc_count": 65
                    },
                    {
                        "key": "life science",
                        "doc_count": 62
                    },
                    {
                        "key": "life sciences",
                        "doc_count": 52
                    },
                    {
                        "key": "biomedical science",
                        "doc_count": 33
                    },
                    {
                        "key": "biologic",
                        "doc_count": 25
                    },
                    {
                        "key": "biological",
                        "doc_count": 25
                    },
                    {
                        "key": "biology",
                        "doc_count": 25
                    },
                    {
                        "key": "engineering",
                        "doc_count": 24
                    },
                    {
                        "key": "engineering science",
                        "doc_count": 24
                    },
                    {
                        "key": "engineering sciences",
                        "doc_count": 24
                    },
                    {
                        "key": "computer science",
                        "doc_count": 23
                    },
                    {
                        "key": "informatics",
                        "doc_count": 18
                    },
                    {
                        "key": "information management",
                        "doc_count": 18
                    },
                    {
                        "key": "information science",
                        "doc_count": 18
                    },
                    {
                        "key": "knowledge management",
                        "doc_count": 18
                    },
                    {
                        "key": "omics",
                        "doc_count": 15
                    },
                    {
                        "key": "biomedical research",
                        "doc_count": 13
                    },
                    {
                        "key": "ontology and terminology",
                        "doc_count": 12
                    },
                    {
                        "key": "medicines research and development",
                        "doc_count": 11
                    },
                    {
                        "key": "preclinical studies",
                        "doc_count": 11
                    },
                    {
                        "key": "biomathematics",
                        "doc_count": 7
                    },
                    {
                        "key": "chemistry",
                        "doc_count": 7
                    },
                    {
                        "key": "computational biology",
                        "doc_count": 7
                    },
                    {
                        "key": "mathematical biology",
                        "doc_count": 7
                    },
                    {
                        "key": "proteomics",
                        "doc_count": 7
                    },
                    {
                        "key": "theoretical biology",
                        "doc_count": 7
                    },
                    {
                        "key": "genomics",
                        "doc_count": 6
                    },
                    {
                        "key": "genomics research",
                        "doc_count": 6
                    },
                    {
                        "key": "medicine",
                        "doc_count": 6
                    },
                    {
                        "key": "data management",
                        "doc_count": 5
                    },
                    {
                        "key": "genetics",
                        "doc_count": 5
                    },
                    {
                        "key": "biochemistry",
                        "doc_count": 4
                    },
                    {
                        "key": "data governance",
                        "doc_count": 4
                    },
                    {
                        "key": "functional genomics",
                        "doc_count": 4
                    },
                    {
                        "key": "earth science",
                        "doc_count": 3
                    },
                    {
                        "key": "earth sciences",
                        "doc_count": 3
                    },
                    {
                        "key": "general genetics",
                        "doc_count": 3
                    },
                    {
                        "key": "geosciences (including geography)",
                        "doc_count": 3
                    },
                    {
                        "key": "health science",
                        "doc_count": 3
                    },
                    {
                        "key": "environmental science",
                        "doc_count": 2
                    },
                    {
                        "key": "epidemiology",
                        "doc_count": 2
                    },
                    {
                        "key": "evolution, anthropology",
                        "doc_count": 2
                    },
                    {
                        "key": "evolutionary biology",
                        "doc_count": 2
                    },
                    {
                        "key": "knowledge and information systems",
                        "doc_count": 2
                    },
                    {
                        "key": "mathematics",
                        "doc_count": 2
                    },
                    {
                        "key": "molecular genetics",
                        "doc_count": 2
                    },
                    {
                        "key": "public health",
                        "doc_count": 2
                    },
                    {
                        "key": "public health, health services research, social medicine",
                        "doc_count": 2
                    },
                    {
                        "key": "transcriptomics",
                        "doc_count": 2
                    },
                    {
                        "key": "zoology",
                        "doc_count": 2
                    },
                    {
                        "key": "atmospheric science",
                        "doc_count": 1
                    },
                    {
                        "key": "biological chemistry",
                        "doc_count": 1
                    },
                    {
                        "key": "chemical engineering",
                        "doc_count": 1
                    },
                    {
                        "key": "cheminformatics",
                        "doc_count": 1
                    },
                    {
                        "key": "ecology",
                        "doc_count": 1
                    },
                    {
                        "key": "economics",
                        "doc_count": 1
                    },
                    {
                        "key": "enzymology",
                        "doc_count": 1
                    },
                    {
                        "key": "humanities and social sciences",
                        "doc_count": 1
                    },
                    {
                        "key": "immunology",
                        "doc_count": 1
                    },
                    {
                        "key": "maths",
                        "doc_count": 1
                    },
                    {
                        "key": "metabolomics",
                        "doc_count": 1
                    },
                    {
                        "key": "nutritional science",
                        "doc_count": 1
                    },
                    {
                        "key": "oceanography",
                        "doc_count": 1
                    },
                    {
                        "key": "oncology",
                        "doc_count": 1
                    },
                    {
                        "key": "phenomics",
                        "doc_count": 1
                    },
                    {
                        "key": "phylogenetic clocks",
                        "doc_count": 1
                    },
                    {
                        "key": "phylogenetic dating",
                        "doc_count": 1
                    },
                    {
                        "key": "phylogenetic simulation",
                        "doc_count": 1
                    },
                    {
                        "key": "phylogenetic stratigraphy",
                        "doc_count": 1
                    },
                    {
                        "key": "phylogenetics",
                        "doc_count": 1
                    },
                    {
                        "key": "phylogeny",
                        "doc_count": 1
                    },
                    {
                        "key": "phylogeny reconstruction",
                        "doc_count": 1
                    },
                    {
                        "key": "physics",
                        "doc_count": 1
                    },
                    {
                        "key": "physiology",
                        "doc_count": 1
                    },
                    {
                        "key": "process engineering",
                        "doc_count": 1
                    },
                    {
                        "key": "process engineering, technical chemistry",
                        "doc_count": 1
                    },
                    {
                        "key": "social and behavioral science",
                        "doc_count": 1
                    },
                    {
                        "key": "social and behavioral sciences",
                        "doc_count": 1
                    },
                    {
                        "key": "social and behavioural science",
                        "doc_count": 1
                    },
                    {
                        "key": "social and behavioural sciences",
                        "doc_count": 1
                    },
                    {
                        "key": "social science",
                        "doc_count": 1
                    },
                    {
                        "key": "statistics",
                        "doc_count": 1
                    },
                    {
                        "key": "systems biology",
                        "doc_count": 1
                    },
                    {
                        "key": "taxonomy",
                        "doc_count": 1
                    },
                    {
                        "key": "thermodynamics",
                        "doc_count": 1
                    },
                    {
                        "key": "translational medicine",
                        "doc_count": 1
                    }
                ]
            },
            "domains": {
                "doc_count": 74,
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [
                    {
                        "key": "entity",
                        "doc_count": 67
                    },
                    {
                        "key": "continuant",
                        "doc_count": 53
                    },
                    {
                        "key": "occurrent",
                        "doc_count": 46
                    },
                    {
                        "key": "process",
                        "doc_count": 46
                    },
                    {
                        "key": "generically dependent continuant",
                        "doc_count": 42
                    },
                    {
                        "key": "information content entity",
                        "doc_count": 42
                    },
                    {
                        "key": "planned process",
                        "doc_count": 33
                    },
                    {
                        "key": "independent continuant",
                        "doc_count": 32
                    },
                    {
                        "key": "material entity",
                        "doc_count": 32
                    },
                    {
                        "key": "data",
                        "doc_count": 30
                    },
                    {
                        "key": "data record",
                        "doc_count": 26
                    },
                    {
                        "key": "data set",
                        "doc_count": 26
                    },
                    {
                        "key": "datum",
                        "doc_count": 26
                    },
                    {
                        "key": "chemical entity",
                        "doc_count": 22
                    },
                    {
                        "key": "object",
                        "doc_count": 22
                    },
                    {
                        "key": "molecular entity",
                        "doc_count": 21
                    },
                    {
                        "key": "heteroorganic entity",
                        "doc_count": 19
                    },
                    {
                        "key": "main group molecular entity",
                        "doc_count": 19
                    },
                    {
                        "key": "nitrogen molecular entity",
                        "doc_count": 19
                    },
                    {
                        "key": "organic molecular entity",
                        "doc_count": 19
                    },
                    {
                        "key": "p-block molecular entity",
                        "doc_count": 19
                    },
                    {
                        "key": "pnictogen molecular entity",
                        "doc_count": 19
                    },
                    {
                        "key": "biological process",
                        "doc_count": 18
                    },
                    {
                        "key": "biological_process",
                        "doc_count": 16
                    },
                    {
                        "key": "physiological process",
                        "doc_count": 16
                    },
                    {
                        "key": "assay",
                        "doc_count": 15
                    },
                    {
                        "key": "organic amino compound",
                        "doc_count": 14
                    },
                    {
                        "key": "organonitrogen compound",
                        "doc_count": 14
                    },
                    {
                        "key": "peptide",
                        "doc_count": 14
                    },
                    {
                        "key": "report",
                        "doc_count": 14
                    },
                    {
                        "key": "amino acid chain",
                        "doc_count": 13
                    },
                    {
                        "key": "document",
                        "doc_count": 13
                    },
                    {
                        "key": "polypeptide",
                        "doc_count": 13
                    },
                    {
                        "key": "protein",
                        "doc_count": 13
                    },
                    {
                        "key": "specifically dependent continuant",
                        "doc_count": 12
                    },
                    {
                        "key": "directive information entity",
                        "doc_count": 10
                    },
                    {
                        "key": "realizable entity",
                        "doc_count": 9
                    },
                    {
                        "key": "specimen",
                        "doc_count": 8
                    },
                    {
                        "key": "cellular localisation",
                        "doc_count": 7
                    },
                    {
                        "key": "cellular localization",
                        "doc_count": 7
                    },
                    {
                        "key": "enzyme transport",
                        "doc_count": 7
                    },
                    {
                        "key": "establishment and maintenance of cellular component location",
                        "doc_count": 7
                    },
                    {
                        "key": "establishment and maintenance of cellular localization",
                        "doc_count": 7
                    },
                    {
                        "key": "establishment and maintenance of localization",
                        "doc_count": 7
                    },
                    {
                        "key": "establishment and maintenance of localization in cell or cell membrane",
                        "doc_count": 7
                    },
                    {
                        "key": "establishment and maintenance of position",
                        "doc_count": 7
                    },
                    {
                        "key": "establishment and maintenance of substance location",
                        "doc_count": 7
                    },
                    {
                        "key": "establishment and maintenance of substrate location",
                        "doc_count": 7
                    },
                    {
                        "key": "establishment of localisation",
                        "doc_count": 7
                    },
                    {
                        "key": "establishment of localization",
                        "doc_count": 7
                    },
                    {
                        "key": "establishment of protein localisation",
                        "doc_count": 7
                    },
                    {
                        "key": "establishment of protein localization",
                        "doc_count": 7
                    },
                    {
                        "key": "intracellular localization",
                        "doc_count": 7
                    },
                    {
                        "key": "intracellular protein transport",
                        "doc_count": 7
                    },
                    {
                        "key": "intracellular transport",
                        "doc_count": 7
                    },
                    {
                        "key": "localisation",
                        "doc_count": 7
                    },
                    {
                        "key": "localization",
                        "doc_count": 7
                    },
                    {
                        "key": "localization within cell",
                        "doc_count": 7
                    },
                    {
                        "key": "peptide transport",
                        "doc_count": 7
                    },
                    {
                        "key": "plan specification",
                        "doc_count": 7
                    },
                    {
                        "key": "protein localisation",
                        "doc_count": 7
                    },
                    {
                        "key": "protein localization",
                        "doc_count": 7
                    },
                    {
                        "key": "protein positioning",
                        "doc_count": 7
                    },
                    {
                        "key": "protein recruitment",
                        "doc_count": 7
                    },
                    {
                        "key": "protein targeting",
                        "doc_count": 7
                    },
                    {
                        "key": "protein transport",
                        "doc_count": 7
                    },
                    {
                        "key": "resource metadata",
                        "doc_count": 7
                    },
                    {
                        "key": "single organism cellular localization",
                        "doc_count": 7
                    },
                    {
                        "key": "small molecule transport",
                        "doc_count": 7
                    },
                    {
                        "key": "solute:solute exchange",
                        "doc_count": 7
                    },
                    {
                        "key": "study design",
                        "doc_count": 7
                    },
                    {
                        "key": "transport",
                        "doc_count": 7
                    },
                    {
                        "key": "biomacromolecule",
                        "doc_count": 6
                    },
                    {
                        "key": "cyclic compound",
                        "doc_count": 6
                    },
                    {
                        "key": "data transformation",
                        "doc_count": 6
                    },
                    {
                        "key": "deoxyribonucleic acid",
                        "doc_count": 6
                    },
                    {
                        "key": "heteroarene",
                        "doc_count": 6
                    },
                    {
                        "key": "information biomacromolecule",
                        "doc_count": 6
                    },
                    {
                        "key": "macromolecule",
                        "doc_count": 6
                    },
                    {
                        "key": "molecular interaction",
                        "doc_count": 6
                    },
                    {
                        "key": "molecule",
                        "doc_count": 6
                    },
                    {
                        "key": "nucleic acid",
                        "doc_count": 6
                    },
                    {
                        "key": "nucleobase-containing molecular entity",
                        "doc_count": 6
                    },
                    {
                        "key": "organic aromatic compound",
                        "doc_count": 6
                    },
                    {
                        "key": "organic cyclic compound",
                        "doc_count": 6
                    },
                    {
                        "key": "organic heterocyclic compound",
                        "doc_count": 6
                    },
                    {
                        "key": "organic molecule",
                        "doc_count": 6
                    },
                    {
                        "key": "polyatomic entity",
                        "doc_count": 6
                    },
                    {
                        "key": "polymer",
                        "doc_count": 6
                    },
                    {
                        "key": "polynucleotide",
                        "doc_count": 6
                    },
                    {
                        "key": "role",
                        "doc_count": 6
                    },
                    {
                        "key": "cellular component",
                        "doc_count": 5
                    },
                    {
                        "key": "centrally registered identifier",
                        "doc_count": 5
                    },
                    {
                        "key": "device",
                        "doc_count": 5
                    },
                    {
                        "key": "experiment metadata",
                        "doc_count": 5
                    },
                    {
                        "key": "gene expression data",
                        "doc_count": 5
                    },
                    {
                        "key": "measurement",
                        "doc_count": 5
                    },
                    {
                        "key": "processed material",
                        "doc_count": 5
                    },
                    {
                        "key": "sequence",
                        "doc_count": 5
                    },
                    {
                        "key": "anatomical entity",
                        "doc_count": 4
                    },
                    {
                        "key": "anatomical structure",
                        "doc_count": 4
                    },
                    {
                        "key": "annotation",
                        "doc_count": 4
                    },
                    {
                        "key": "application",
                        "doc_count": 4
                    },
                    {
                        "key": "assay array",
                        "doc_count": 4
                    },
                    {
                        "key": "biological structure",
                        "doc_count": 4
                    },
                    {
                        "key": "cell or subcellular entity",
                        "doc_count": 4
                    },
                    {
                        "key": "cellular_component",
                        "doc_count": 4
                    },
                    {
                        "key": "computational method",
                        "doc_count": 4
                    },
                    {
                        "key": "computational operation",
                        "doc_count": 4
                    },
                    {
                        "key": "computational procedure",
                        "doc_count": 4
                    },
                    {
                        "key": "computational subroutine",
                        "doc_count": 4
                    },
                    {
                        "key": "connected biological structure",
                        "doc_count": 4
                    },
                    {
                        "key": "data analysis",
                        "doc_count": 4
                    },
                    {
                        "key": "data item",
                        "doc_count": 4
                    },
                    {
                        "key": "data management",
                        "doc_count": 4
                    },
                    {
                        "key": "data processing",
                        "doc_count": 4
                    },
                    {
                        "key": "digital curation",
                        "doc_count": 4
                    },
                    {
                        "key": "disposition",
                        "doc_count": 4
                    },
                    {
                        "key": "dna microarray",
                        "doc_count": 4
                    },
                    {
                        "key": "experimental design",
                        "doc_count": 4
                    },
                    {
                        "key": "experimental measurement",
                        "doc_count": 4
                    },
                    {
                        "key": "function (programming)",
                        "doc_count": 4
                    },
                    {
                        "key": "instrument",
                        "doc_count": 4
                    },
                    {
                        "key": "lambda abstraction",
                        "doc_count": 4
                    },
                    {
                        "key": "material anatomical entity",
                        "doc_count": 4
                    },
                    {
                        "key": "mathematical function",
                        "doc_count": 4
                    },
                    {
                        "key": "mathematical operation",
                        "doc_count": 4
                    },
                    {
                        "key": "microarray",
                        "doc_count": 4
                    },
                    {
                        "key": "operation",
                        "doc_count": 4
                    },
                    {
                        "key": "quality",
                        "doc_count": 4
                    },
                    {
                        "key": "reagent",
                        "doc_count": 4
                    },
                    {
                        "key": "technique",
                        "doc_count": 4
                    },
                    {
                        "key": "biological region",
                        "doc_count": 3
                    },
                    {
                        "key": "biological sample",
                        "doc_count": 3
                    },
                    {
                        "key": "biological_region",
                        "doc_count": 3
                    },
                    {
                        "key": "cell",
                        "doc_count": 3
                    },
                    {
                        "key": "data acquisition",
                        "doc_count": 3
                    },
                    {
                        "key": "data identity and mapping",
                        "doc_count": 3
                    },
                    {
                        "key": "disease",
                        "doc_count": 3
                    },
                    {
                        "key": "experimental measurement data",
                        "doc_count": 3
                    },
                    {
                        "key": "experimentally measured data",
                        "doc_count": 3
                    },
                    {
                        "key": "gene member region",
                        "doc_count": 3
                    },
                    {
                        "key": "gene_member_region",
                        "doc_count": 3
                    },
                    {
                        "key": "insdc_feature:misc_feature",
                        "doc_count": 3
                    },
                    {
                        "key": "insdc_note:biological_region",
                        "doc_count": 3
                    },
                    {
                        "key": "insdc_note:other",
                        "doc_count": 3
                    },
                    {
                        "key": "insdc_note:sequence_feature",
                        "doc_count": 3
                    },
                    {
                        "key": "located_sequence_feature",
                        "doc_count": 3
                    },
                    {
                        "key": "mass spectrometry spectra",
                        "doc_count": 3
                    },
                    {
                        "key": "mathematical model",
                        "doc_count": 3
                    },
                    {
                        "key": "measured data",
                        "doc_count": 3
                    },
                    {
                        "key": "measurement data",
                        "doc_count": 3
                    },
                    {
                        "key": "measurement metadata",
                        "doc_count": 3
                    },
                    {
                        "key": "mi",
                        "doc_count": 3
                    },
                    {
                        "key": "phenotype",
                        "doc_count": 3
                    },
                    {
                        "key": "raw experimental data",
                        "doc_count": 3
                    },
                    {
                        "key": "region",
                        "doc_count": 3
                    },
                    {
                        "key": "ribonucleic acid",
                        "doc_count": 3
                    },
                    {
                        "key": "sequence collection",
                        "doc_count": 3
                    },
                    {
                        "key": "sequence feature",
                        "doc_count": 3
                    },
                    {
                        "key": "sequence_collection",
                        "doc_count": 3
                    },
                    {
                        "key": "sequence_feature",
                        "doc_count": 3
                    },
                    {
                        "key": "transcript",
                        "doc_count": 3
                    },
                    {
                        "key": "any method",
                        "doc_count": 2
                    },
                    {
                        "key": "association",
                        "doc_count": 2
                    },
                    {
                        "key": "biological material interval",
                        "doc_count": 2
                    },
                    {
                        "key": "data model",
                        "doc_count": 2
                    },
                    {
                        "key": "dna interval",
                        "doc_count": 2
                    },
                    {
                        "key": "dna sequence",
                        "doc_count": 2
                    },
                    {
                        "key": "dna sequence data",
                        "doc_count": 2
                    },
                    {
                        "key": "enzymatic reaction",
                        "doc_count": 2
                    },
                    {
                        "key": "functional association",
                        "doc_count": 2
                    },
                    {
                        "key": "genetic interval",
                        "doc_count": 2
                    },
                    {
                        "key": "genetic marker",
                        "doc_count": 2
                    },
                    {
                        "key": "genetic material interval",
                        "doc_count": 2
                    },
                    {
                        "key": "genome",
                        "doc_count": 2
                    },
                    {
                        "key": "genomic material interval",
                        "doc_count": 2
                    },
                    {
                        "key": "id",
                        "doc_count": 2
                    },
                    {
                        "key": "identifier",
                        "doc_count": 2
                    },
                    {
                        "key": "identifier (typed)",
                        "doc_count": 2
                    },
                    {
                        "key": "investigation",
                        "doc_count": 2
                    },
                    {
                        "key": "material processing",
                        "doc_count": 2
                    },
                    {
                        "key": "material transformation",
                        "doc_count": 2
                    },
                    {
                        "key": "material transformations",
                        "doc_count": 2
                    },
                    {
                        "key": "measurement method",
                        "doc_count": 2
                    },
                    {
                        "key": "measuring",
                        "doc_count": 2
                    },
                    {
                        "key": "metagenome",
                        "doc_count": 2
                    },
                    {
                        "key": "name",
                        "doc_count": 2
                    },
                    {
                        "key": "nucleic acid sequence",
                        "doc_count": 2
                    },
                    {
                        "key": "nucleic acid sequences",
                        "doc_count": 2
                    },
                    {
                        "key": "nucleotide sequence",
                        "doc_count": 2
                    },
                    {
                        "key": "nucleotide sequences",
                        "doc_count": 2
                    },
                    {
                        "key": "pathogen",
                        "doc_count": 2
                    },
                    {
                        "key": "pathway model",
                        "doc_count": 2
                    },
                    {
                        "key": "preparative method",
                        "doc_count": 2
                    },
                    {
                        "key": "protocol",
                        "doc_count": 2
                    },
                    {
                        "key": "sample preparation",
                        "doc_count": 2
                    },
                    {
                        "key": "sample preparation step",
                        "doc_count": 2
                    },
                    {
                        "key": "sample preparative method",
                        "doc_count": 2
                    },
                    {
                        "key": "scientific observation",
                        "doc_count": 2
                    },
                    {
                        "key": "sequences",
                        "doc_count": 2
                    },
                    {
                        "key": "study",
                        "doc_count": 2
                    },
                    {
                        "key": "study assay",
                        "doc_count": 2
                    },
                    {
                        "key": "symbolic name",
                        "doc_count": 2
                    },
                    {
                        "key": "systematic review",
                        "doc_count": 2
                    },
                    {
                        "key": "accuracy",
                        "doc_count": 1
                    },
                    {
                        "key": "agranular leukocyte",
                        "doc_count": 1
                    },
                    {
                        "key": "animal cell",
                        "doc_count": 1
                    },
                    {
                        "key": "animal research",
                        "doc_count": 1
                    },
                    {
                        "key": "antibody",
                        "doc_count": 1
                    },
                    {
                        "key": "article data",
                        "doc_count": 1
                    },
                    {
                        "key": "behavior",
                        "doc_count": 1
                    },
                    {
                        "key": "biobank",
                        "doc_count": 1
                    },
                    {
                        "key": "biological role",
                        "doc_count": 1
                    },
                    {
                        "key": "biopolymer metabolic process",
                        "doc_count": 1
                    },
                    {
                        "key": "cancer",
                        "doc_count": 1
                    },
                    {
                        "key": "carboxamide",
                        "doc_count": 1
                    },
                    {
                        "key": "cell in vivo",
                        "doc_count": 1
                    },
                    {
                        "key": "chalcogen molecular entity",
                        "doc_count": 1
                    },
                    {
                        "key": "chemical descriptor",
                        "doc_count": 1
                    },
                    {
                        "key": "chemical structure",
                        "doc_count": 1
                    },
                    {
                        "key": "citation",
                        "doc_count": 1
                    },
                    {
                        "key": "clinical data item",
                        "doc_count": 1
                    },
                    {
                        "key": "clinical measurement",
                        "doc_count": 1
                    },
                    {
                        "key": "cytometry assay",
                        "doc_count": 1
                    },
                    {
                        "key": "data retrieval",
                        "doc_count": 1
                    },
                    {
                        "key": "derived data from inferential statistical analysis",
                        "doc_count": 1
                    },
                    {
                        "key": "derived data from statistical analysis",
                        "doc_count": 1
                    },
                    {
                        "key": "diagnosis",
                        "doc_count": 1
                    },
                    {
                        "key": "disease course",
                        "doc_count": 1
                    },
                    {
                        "key": "disease onset",
                        "doc_count": 1
                    },
                    {
                        "key": "dissociation constant",
                        "doc_count": 1
                    },
                    {
                        "key": "electrophoresis",
                        "doc_count": 1
                    },
                    {
                        "key": "environmental material",
                        "doc_count": 1
                    },
                    {
                        "key": "enzyme",
                        "doc_count": 1
                    },
                    {
                        "key": "equilibrium or steady-state characteristic",
                        "doc_count": 1
                    },
                    {
                        "key": "equilibrium or steady-state constant",
                        "doc_count": 1
                    },
                    {
                        "key": "eukaryotic cell",
                        "doc_count": 1
                    },
                    {
                        "key": "fiat object",
                        "doc_count": 1
                    },
                    {
                        "key": "figure",
                        "doc_count": 1
                    },
                    {
                        "key": "flow cytometry assay",
                        "doc_count": 1
                    },
                    {
                        "key": "function",
                        "doc_count": 1
                    },
                    {
                        "key": "gene",
                        "doc_count": 1
                    },
                    {
                        "key": "gene expression",
                        "doc_count": 1
                    },
                    {
                        "key": "gene functional annotation",
                        "doc_count": 1
                    },
                    {
                        "key": "gene name",
                        "doc_count": 1
                    },
                    {
                        "key": "gene ontology enrichment",
                        "doc_count": 1
                    },
                    {
                        "key": "genetic association study",
                        "doc_count": 1
                    },
                    {
                        "key": "genome-wide association study",
                        "doc_count": 1
                    },
                    {
                        "key": "geographical location",
                        "doc_count": 1
                    },
                    {
                        "key": "haematopoietic cell",
                        "doc_count": 1
                    },
                    {
                        "key": "haemopoietic cell",
                        "doc_count": 1
                    },
                    {
                        "key": "hematopoietic cell",
                        "doc_count": 1
                    },
                    {
                        "key": "hemopoietic cell",
                        "doc_count": 1
                    },
                    {
                        "key": "image",
                        "doc_count": 1
                    },
                    {
                        "key": "immune cell",
                        "doc_count": 1
                    },
                    {
                        "key": "immunity",
                        "doc_count": 1
                    },
                    {
                        "key": "immunoglobulin complex",
                        "doc_count": 1
                    },
                    {
                        "key": "in vivo design",
                        "doc_count": 1
                    },
                    {
                        "key": "independent variable",
                        "doc_count": 1
                    },
                    {
                        "key": "inferential statistic",
                        "doc_count": 1
                    },
                    {
                        "key": "inhibitory constant",
                        "doc_count": 1
                    },
                    {
                        "key": "interactome",
                        "doc_count": 1
                    },
                    {
                        "key": "knowledge representation",
                        "doc_count": 1
                    },
                    {
                        "key": "leucocyte",
                        "doc_count": 1
                    },
                    {
                        "key": "leukocyte",
                        "doc_count": 1
                    },
                    {
                        "key": "lipid",
                        "doc_count": 1
                    },
                    {
                        "key": "lymphocyte",
                        "doc_count": 1
                    },
                    {
                        "key": "macromolecular complex",
                        "doc_count": 1
                    },
                    {
                        "key": "macromolecule complex",
                        "doc_count": 1
                    },
                    {
                        "key": "macromolecule metabolic process",
                        "doc_count": 1
                    },
                    {
                        "key": "macromolecule metabolism",
                        "doc_count": 1
                    },
                    {
                        "key": "marine metagenome",
                        "doc_count": 1
                    },
                    {
                        "key": "mass spectrometry assay",
                        "doc_count": 1
                    },
                    {
                        "key": "material component separation",
                        "doc_count": 1
                    },
                    {
                        "key": "mature transcript",
                        "doc_count": 1
                    },
                    {
                        "key": "mature_transcript",
                        "doc_count": 1
                    },
                    {
                        "key": "medical intervention",
                        "doc_count": 1
                    },
                    {
                        "key": "metabolic process",
                        "doc_count": 1
                    },
                    {
                        "key": "metabolic process resulting in cell growth",
                        "doc_count": 1
                    },
                    {
                        "key": "metabolism",
                        "doc_count": 1
                    },
                    {
                        "key": "metabolism resulting in cell growth",
                        "doc_count": 1
                    },
                    {
                        "key": "metabolite",
                        "doc_count": 1
                    },
                    {
                        "key": "michaelis constant",
                        "doc_count": 1
                    },
                    {
                        "key": "microbiome",
                        "doc_count": 1
                    },
                    {
                        "key": "molecular function",
                        "doc_count": 1
                    },
                    {
                        "key": "molecular structure",
                        "doc_count": 1
                    },
                    {
                        "key": "monadic quality of a continuant",
                        "doc_count": 1
                    },
                    {
                        "key": "monadic quality of an object",
                        "doc_count": 1
                    },
                    {
                        "key": "monadic quality of continuant",
                        "doc_count": 1
                    },
                    {
                        "key": "morphology",
                        "doc_count": 1
                    },
                    {
                        "key": "motile cell",
                        "doc_count": 1
                    },
                    {
                        "key": "multicellular anatomical structure",
                        "doc_count": 1
                    },
                    {
                        "key": "multicellular organism metabolic process",
                        "doc_count": 1
                    },
                    {
                        "key": "multicellular organismal macromolecule metabolic process",
                        "doc_count": 1
                    },
                    {
                        "key": "multicellular organismal process",
                        "doc_count": 1
                    },
                    {
                        "key": "multicellular structure",
                        "doc_count": 1
                    },
                    {
                        "key": "multiply inhering quality of a physical entity",
                        "doc_count": 1
                    },
                    {
                        "key": "native cell",
                        "doc_count": 1
                    },
                    {
                        "key": "network model",
                        "doc_count": 1
                    },
                    {
                        "key": "non-coding rna",
                        "doc_count": 1
                    },
                    {
                        "key": "non-randomized controlled trials",
                        "doc_count": 1
                    },
                    {
                        "key": "nongranular leukocyte",
                        "doc_count": 1
                    },
                    {
                        "key": "nucleate cell",
                        "doc_count": 1
                    },
                    {
                        "key": "nucleic acid hybridization",
                        "doc_count": 1
                    },
                    {
                        "key": "observation design",
                        "doc_count": 1
                    },
                    {
                        "key": "organic molecular entity metabolic process",
                        "doc_count": 1
                    },
                    {
                        "key": "organic molecular entity metabolism",
                        "doc_count": 1
                    },
                    {
                        "key": "organic substance metabolic process",
                        "doc_count": 1
                    },
                    {
                        "key": "organic substance metabolism",
                        "doc_count": 1
                    },
                    {
                        "key": "organism name",
                        "doc_count": 1
                    },
                    {
                        "key": "organismal macromolecule metabolism",
                        "doc_count": 1
                    },
                    {
                        "key": "organismal physiological process",
                        "doc_count": 1
                    },
                    {
                        "key": "organochalcogen compound",
                        "doc_count": 1
                    },
                    {
                        "key": "organooxygen compound",
                        "doc_count": 1
                    },
                    {
                        "key": "patient care",
                        "doc_count": 1
                    },
                    {
                        "key": "physical object quality",
                        "doc_count": 1
                    },
                    {
                        "key": "population",
                        "doc_count": 1
                    },
                    {
                        "key": "prognosis",
                        "doc_count": 1
                    },
                    {
                        "key": "protein complex",
                        "doc_count": 1
                    },
                    {
                        "key": "protein containing complex",
                        "doc_count": 1
                    },
                    {
                        "key": "protein interaction",
                        "doc_count": 1
                    },
                    {
                        "key": "protein-containing complex",
                        "doc_count": 1
                    },
                    {
                        "key": "protein-protein complex",
                        "doc_count": 1
                    },
                    {
                        "key": "pseudogene",
                        "doc_count": 1
                    },
                    {
                        "key": "quality control",
                        "doc_count": 1
                    },
                    {
                        "key": "quality of a continuant",
                        "doc_count": 1
                    },
                    {
                        "key": "quality of a single physical entity",
                        "doc_count": 1
                    },
                    {
                        "key": "quality of an object",
                        "doc_count": 1
                    },
                    {
                        "key": "quality of continuant",
                        "doc_count": 1
                    },
                    {
                        "key": "real time polymerase chain reaction",
                        "doc_count": 1
                    },
                    {
                        "key": "relational structural quality",
                        "doc_count": 1
                    },
                    {
                        "key": "resource collection",
                        "doc_count": 1
                    },
                    {
                        "key": "scientific text data",
                        "doc_count": 1
                    },
                    {
                        "key": "sequence annotation",
                        "doc_count": 1
                    },
                    {
                        "key": "small molecule",
                        "doc_count": 1
                    },
                    {
                        "key": "somatic cell",
                        "doc_count": 1
                    },
                    {
                        "key": "statistic",
                        "doc_count": 1
                    },
                    {
                        "key": "structure",
                        "doc_count": 1
                    },
                    {
                        "key": "systems description parameter",
                        "doc_count": 1
                    },
                    {
                        "key": "t cell",
                        "doc_count": 1
                    },
                    {
                        "key": "target",
                        "doc_count": 1
                    },
                    {
                        "key": "taxonomic classification",
                        "doc_count": 1
                    },
                    {
                        "key": "text data",
                        "doc_count": 1
                    },
                    {
                        "key": "therapeutic intervention",
                        "doc_count": 1
                    },
                    {
                        "key": "tissue",
                        "doc_count": 1
                    },
                    {
                        "key": "transformed data item",
                        "doc_count": 1
                    },
                    {
                        "key": "tumor",
                        "doc_count": 1
                    },
                    {
                        "key": "unit",
                        "doc_count": 1
                    },
                    {
                        "key": "white blood cell",
                        "doc_count": 1
                    }
                ]
            },
            "countries": {
                "doc_count": 74,
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [
                    {
                        "key": "united states of america",
                        "doc_count": 44
                    },
                    {
                        "key": "united kingdom of great britain and northern ireland",
                        "doc_count": 37
                    },
                    {
                        "key": "germany",
                        "doc_count": 23
                    },
                    {
                        "key": "all",
                        "doc_count": 14
                    },
                    {
                        "key": "netherlands",
                        "doc_count": 11
                    },
                    {
                        "key": "canada",
                        "doc_count": 10
                    },
                    {
                        "key": "european union",
                        "doc_count": 10
                    },
                    {
                        "key": "france",
                        "doc_count": 10
                    },
                    {
                        "key": "denmark",
                        "doc_count": 9
                    },
                    {
                        "key": "switzerland",
                        "doc_count": 9
                    },
                    {
                        "key": "spain",
                        "doc_count": 7
                    },
                    {
                        "key": "australia",
                        "doc_count": 6
                    },
                    {
                        "key": "belgium",
                        "doc_count": 6
                    },
                    {
                        "key": "austria",
                        "doc_count": 4
                    },
                    {
                        "key": "sweden",
                        "doc_count": 4
                    },
                    {
                        "key": "china",
                        "doc_count": 3
                    },
                    {
                        "key": "italy",
                        "doc_count": 3
                    },
                    {
                        "key": "czech republic",
                        "doc_count": 2
                    },
                    {
                        "key": "ireland",
                        "doc_count": 2
                    },
                    {
                        "key": "japan",
                        "doc_count": 2
                    },
                    {
                        "key": "argentina",
                        "doc_count": 1
                    },
                    {
                        "key": "brazil",
                        "doc_count": 1
                    },
                    {
                        "key": "croatia",
                        "doc_count": 1
                    },
                    {
                        "key": "finland",
                        "doc_count": 1
                    },
                    {
                        "key": "greece",
                        "doc_count": 1
                    },
                    {
                        "key": "hungary",
                        "doc_count": 1
                    },
                    {
                        "key": "iceland",
                        "doc_count": 1
                    },
                    {
                        "key": "israel",
                        "doc_count": 1
                    },
                    {
                        "key": "kenya",
                        "doc_count": 1
                    },
                    {
                        "key": "lithuania",
                        "doc_count": 1
                    },
                    {
                        "key": "luxembourg",
                        "doc_count": 1
                    },
                    {
                        "key": "malta",
                        "doc_count": 1
                    },
                    {
                        "key": "montenegro",
                        "doc_count": 1
                    },
                    {
                        "key": "new zealand",
                        "doc_count": 1
                    },
                    {
                        "key": "norway",
                        "doc_count": 1
                    },
                    {
                        "key": "portugal",
                        "doc_count": 1
                    },
                    {
                        "key": "saudi arabia",
                        "doc_count": 1
                    },
                    {
                        "key": "singapore",
                        "doc_count": 1
                    },
                    {
                        "key": "slovakia",
                        "doc_count": 1
                    }
                ]
            },
            "journals": {
                "doc_count": 74,
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [
                    {
                        "key": "nat biotechnol",
                        "doc_count": 6
                    },
                    {
                        "key": "nucleic acids res",
                        "doc_count": 5
                    },
                    {
                        "key": "bioinformatics",
                        "doc_count": 4
                    },
                    {
                        "key": "biorxiv (preprint)",
                        "doc_count": 4
                    },
                    {
                        "key": "database (oxford)",
                        "doc_count": 4
                    },
                    {
                        "key": "plos one",
                        "doc_count": 4
                    },
                    {
                        "key": "bmj",
                        "doc_count": 3
                    },
                    {
                        "key": "j biomed semantics",
                        "doc_count": 3
                    },
                    {
                        "key": "bmc bioinformatics",
                        "doc_count": 2
                    },
                    {
                        "key": "bmc biol.",
                        "doc_count": 2
                    },
                    {
                        "key": "bmc med",
                        "doc_count": 2
                    },
                    {
                        "key": "bmj open",
                        "doc_count": 2
                    },
                    {
                        "key": "j clin epidemiol",
                        "doc_count": 2
                    },
                    {
                        "key": "nat genet",
                        "doc_count": 2
                    },
                    {
                        "key": "nucleic acids res.",
                        "doc_count": 2
                    },
                    {
                        "key": "peerj",
                        "doc_count": 2
                    },
                    {
                        "key": "plos med",
                        "doc_count": 2
                    },
                    {
                        "key": "am j hum genet",
                        "doc_count": 1
                    },
                    {
                        "key": "am j occup ther",
                        "doc_count": 1
                    },
                    {
                        "key": "am j public health",
                        "doc_count": 1
                    },
                    {
                        "key": "ann behav med",
                        "doc_count": 1
                    },
                    {
                        "key": "ann intern med",
                        "doc_count": 1
                    },
                    {
                        "key": "archival science",
                        "doc_count": 1
                    },
                    {
                        "key": "biochem pharmacol",
                        "doc_count": 1
                    },
                    {
                        "key": "biophys j",
                        "doc_count": 1
                    },
                    {
                        "key": "biophys. chem.",
                        "doc_count": 1
                    },
                    {
                        "key": "bmc genomics",
                        "doc_count": 1
                    },
                    {
                        "key": "bmc mol biol",
                        "doc_count": 1
                    },
                    {
                        "key": "bmc syst biol",
                        "doc_count": 1
                    },
                    {
                        "key": "br. j. cancer",
                        "doc_count": 1
                    },
                    {
                        "key": "chemistry international",
                        "doc_count": 1
                    },
                    {
                        "key": "clin chem",
                        "doc_count": 1
                    },
                    {
                        "key": "clin genet",
                        "doc_count": 1
                    },
                    {
                        "key": "clin. chem.",
                        "doc_count": 1
                    },
                    {
                        "key": "cytogenet cell genet",
                        "doc_count": 1
                    },
                    {
                        "key": "cytometry",
                        "doc_count": 1
                    },
                    {
                        "key": "cytometry a",
                        "doc_count": 1
                    },
                    {
                        "key": "f1000res",
                        "doc_count": 1
                    },
                    {
                        "key": "forsch komplementmed",
                        "doc_count": 1
                    },
                    {
                        "key": "front bioeng biotechnol",
                        "doc_count": 1
                    },
                    {
                        "key": "front physiol",
                        "doc_count": 1
                    },
                    {
                        "key": "health qual life outcomes",
                        "doc_count": 1
                    },
                    {
                        "key": "immunity",
                        "doc_count": 1
                    },
                    {
                        "key": "international journal for quality in health care",
                        "doc_count": 1
                    },
                    {
                        "key": "international journal of digital curation",
                        "doc_count": 1
                    },
                    {
                        "key": "j altern complement med",
                        "doc_count": 1
                    },
                    {
                        "key": "j cheminform",
                        "doc_count": 1
                    },
                    {
                        "key": "j comput aided mol des",
                        "doc_count": 1
                    },
                    {
                        "key": "j integr bioinform",
                        "doc_count": 1
                    },
                    {
                        "key": "j proteome res.",
                        "doc_count": 1
                    },
                    {
                        "key": "jama",
                        "doc_count": 1
                    },
                    {
                        "key": "metabolomics",
                        "doc_count": 1
                    },
                    {
                        "key": "missing",
                        "doc_count": 1
                    },
                    {
                        "key": "mol cell proteomics",
                        "doc_count": 1
                    },
                    {
                        "key": "nat biotechnol.",
                        "doc_count": 1
                    },
                    {
                        "key": "nat chem biol.",
                        "doc_count": 1
                    },
                    {
                        "key": "nat methods",
                        "doc_count": 1
                    },
                    {
                        "key": "nat. biotechnol.",
                        "doc_count": 1
                    },
                    {
                        "key": "nature biotechnology",
                        "doc_count": 1
                    },
                    {
                        "key": "neuron",
                        "doc_count": 1
                    },
                    {
                        "key": "nucleic acid research",
                        "doc_count": 1
                    },
                    {
                        "key": "obstet gynecol",
                        "doc_count": 1
                    },
                    {
                        "key": "perspectives in science",
                        "doc_count": 1
                    },
                    {
                        "key": "plos biol",
                        "doc_count": 1
                    },
                    {
                        "key": "plos comput. biol.",
                        "doc_count": 1
                    },
                    {
                        "key": "plos med.",
                        "doc_count": 1
                    },
                    {
                        "key": "plos medicine",
                        "doc_count": 1
                    },
                    {
                        "key": "proc acm/ieee joint conf digit libr",
                        "doc_count": 1
                    },
                    {
                        "key": "prog biophys mol biol",
                        "doc_count": 1
                    },
                    {
                        "key": "pure and applied chemistry, vol 78 (3), 541-612,",
                        "doc_count": 1
                    },
                    {
                        "key": "qual life res",
                        "doc_count": 1
                    },
                    {
                        "key": "sao/nasa astrophysics data system",
                        "doc_count": 1
                    },
                    {
                        "key": "sci data",
                        "doc_count": 1
                    },
                    {
                        "key": "scientificworldjournal",
                        "doc_count": 1
                    },
                    {
                        "key": "social science computer review",
                        "doc_count": 1
                    },
                    {
                        "key": "stand genomic sci",
                        "doc_count": 1
                    },
                    {
                        "key": "stud health technol inform",
                        "doc_count": 1
                    },
                    {
                        "key": "the febs j.",
                        "doc_count": 1
                    },
                    {
                        "key": "trends biochem sci",
                        "doc_count": 1
                    },
                    {
                        "key": "zhong xi yi jie he xue bao",
                        "doc_count": 1
                    }
                ]
            },
            "record_type": {
                "doc_count": 74,
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [
                    {
                        "key": "reporting_guideline",
                        "doc_count": 38
                    },
                    {
                        "key": "terminology_artefact",
                        "doc_count": 16
                    },
                    {
                        "key": "model_and_format",
                        "doc_count": 13
                    },
                    {
                        "key": "metric",
                        "doc_count": 4
                    },
                    {
                        "key": "identifier_schema",
                        "doc_count": 3
                    }
                ]
            },
            "is_recommended": {
                "doc_count": 74,
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [
                    {
                        "key": "true",
                        "key_as_string": "true",
                        "doc_count": 74
                    }
                ]
            },
            "organisations": {
                "doc_count": 74,
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [
                    {
                        "key": "national institutes of health (nih), bethesda, md, usa",
                        "doc_count": 15
                    },
                    {
                        "key": "nih common fund, usa",
                        "doc_count": 10
                    },
                    {
                        "key": "national science foundation (nsf), usa",
                        "doc_count": 8
                    },
                    {
                        "key": "elixir italy",
                        "doc_count": 6
                    },
                    {
                        "key": "national human genome research institute (nhgri), bethesda, md, usa",
                        "doc_count": 6
                    },
                    {
                        "key": "national institute of allergy and infectious diseases (niad), bethesda, md, usa",
                        "doc_count": 6
                    },
                    {
                        "key": "biotechnology and biological sciences research council (bbsrc), uk",
                        "doc_count": 5
                    },
                    {
                        "key": "european commission",
                        "doc_count": 5
                    },
                    {
                        "key": "medical research council (mrc), london, uk",
                        "doc_count": 5
                    },
                    {
                        "key": "oxford e-research centre, department of engineering science, university of oxford, oxford, uk",
                        "doc_count": 5
                    },
                    {
                        "key": "dutch techcentre for life sciences, utrecht, the netherlands",
                        "doc_count": 4
                    },
                    {
                        "key": "hupo-psi initiative; mi administrators",
                        "doc_count": 4
                    },
                    {
                        "key": "institute of data science, maastricht university, maastricht, the netherlands",
                        "doc_count": 4
                    },
                    {
                        "key": "national heart, lung and blood institute (nhlbi), national institutes of health (nih), bethesda, md, usa",
                        "doc_count": 4
                    },
                    {
                        "key": "national institute for health research (nihr), uk",
                        "doc_count": 4
                    },
                    {
                        "key": "proteomics standards initiative (psi) - human proteomics organisation (hupo)",
                        "doc_count": 4
                    },
                    {
                        "key": "the wellcome trust, uk",
                        "doc_count": 4
                    },
                    {
                        "key": "u.s. national library of medicine",
                        "doc_count": 4
                    },
                    {
                        "key": "wilkinson laboratory, centro de biotecnolog?a y gen?mica de plantas, upm-inia, madrid, spain",
                        "doc_count": 4
                    },
                    {
                        "key": "canadian institutes of health research (cihr)",
                        "doc_count": 3
                    },
                    {
                        "key": "cancer research uk",
                        "doc_count": 3
                    },
                    {
                        "key": "computational modeling in biology network (combine)",
                        "doc_count": 3
                    },
                    {
                        "key": "engineering and physical sciences research council (epsrc), uk",
                        "doc_count": 3
                    },
                    {
                        "key": "european bioinformatics institute (embl-ebi), wellcome genome campus, hinxton, cambridgeshire, uk",
                        "doc_count": 3
                    },
                    {
                        "key": "national institute of general medical sciences (nigms), bethesda, md, usa",
                        "doc_count": 3
                    },
                    {
                        "key": "the consort group",
                        "doc_count": 3
                    },
                    {
                        "key": "beilstein-institut, frankfurt am main, germany",
                        "doc_count": 2
                    },
                    {
                        "key": "elixir-hub, uk",
                        "doc_count": 2
                    },
                    {
                        "key": "european commission fp7",
                        "doc_count": 2
                    },
                    {
                        "key": "european community seventh framework programme",
                        "doc_count": 2
                    },
                    {
                        "key": "european molecular biology laboratory (embl), heidelberg, germany",
                        "doc_count": 2
                    },
                    {
                        "key": "future of research communications and e-scholarship (force11), ja lolla, ca, usa",
                        "doc_count": 2
                    },
                    {
                        "key": "illuminating the druggable genome (idg) consortium",
                        "doc_count": 2
                    },
                    {
                        "key": "national human genome research institute (nhgri), nih, united states",
                        "doc_count": 2
                    },
                    {
                        "key": "national institute of neurological disorders and stroke (ninds), bethesda, md, usa",
                        "doc_count": 2
                    },
                    {
                        "key": "national natural science foundation of china (nsfc), beijing, china",
                        "doc_count": 2
                    },
                    {
                        "key": "niddk",
                        "doc_count": 2
                    },
                    {
                        "key": "the ottawa hospital research institute",
                        "doc_count": 2
                    },
                    {
                        "key": "u.s. department of energy",
                        "doc_count": 2
                    },
                    {
                        "key": "university of oxford, uk",
                        "doc_count": 2
                    },
                    {
                        "key": "@neurist, center for computational and simulation technologies in biomedicine, department of mechanical engineering, university of sheffield, sheffield, united kingdom",
                        "doc_count": 1
                    },
                    {
                        "key": "air force research laboratory, usa",
                        "doc_count": 1
                    },
                    {
                        "key": "alfred wegener institute, helmholtz center for polar and marine research (awi), germany",
                        "doc_count": 1
                    },
                    {
                        "key": "american occupational therapy association, usa",
                        "doc_count": 1
                    },
                    {
                        "key": "american occupational therapy foundation, usa",
                        "doc_count": 1
                    },
                    {
                        "key": "association for information science and technology (asis&t)",
                        "doc_count": 1
                    },
                    {
                        "key": "bank for international settlements (bis)",
                        "doc_count": 1
                    },
                    {
                        "key": "bao administrators",
                        "doc_count": 1
                    },
                    {
                        "key": "bill and melinda gates foundation, seattle, washington, usa",
                        "doc_count": 1
                    },
                    {
                        "key": "bio-ontology research group, kaust, saudi arabia",
                        "doc_count": 1
                    },
                    {
                        "key": "bmj case reports",
                        "doc_count": 1
                    },
                    {
                        "key": "british heart foundation",
                        "doc_count": 1
                    },
                    {
                        "key": "british heart foundation programme grant",
                        "doc_count": 1
                    },
                    {
                        "key": "california institute for regenerative medicine",
                        "doc_count": 1
                    },
                    {
                        "key": "california institute of technology",
                        "doc_count": 1
                    },
                    {
                        "key": "cellml community",
                        "doc_count": 1
                    },
                    {
                        "key": "center for open science (cos), charlottesville, va, usa",
                        "doc_count": 1
                    },
                    {
                        "key": "centers for disease control and prevention, usa",
                        "doc_count": 1
                    },
                    {
                        "key": "clinical evidence bmj knowledge",
                        "doc_count": 1
                    },
                    {
                        "key": "cochrane collaboration",
                        "doc_count": 1
                    },
                    {
                        "key": "college of bioinformatics science and technology, harbin medical university, harbin, china",
                        "doc_count": 1
                    },
                    {
                        "key": "computational biology and informatics laboratory (cbil), university of pennsylvania, philadelphia, pa, usa",
                        "doc_count": 1
                    },
                    {
                        "key": "cosmos european union fp7",
                        "doc_count": 1
                    },
                    {
                        "key": "crossref, lynnfield, ma, usa",
                        "doc_count": 1
                    },
                    {
                        "key": "czech academy of science (cas), prague, czech republic",
                        "doc_count": 1
                    },
                    {
                        "key": "data documentation initiative (ddi) alliance",
                        "doc_count": 1
                    },
                    {
                        "key": "datacite, hannover, germany",
                        "doc_count": 1
                    },
                    {
                        "key": "department of computer science, university of aberystwyth",
                        "doc_count": 1
                    },
                    {
                        "key": "department of orthopedic surgery, new york, ny, usa",
                        "doc_count": 1
                    },
                    {
                        "key": "deutsche forschungsgemeinschaft",
                        "doc_count": 1
                    },
                    {
                        "key": "deutsches arzteblatt, cologne, germany",
                        "doc_count": 1
                    },
                    {
                        "key": "e-rare project hipbi-rd",
                        "doc_count": 1
                    },
                    {
                        "key": "eagle-i",
                        "doc_count": 1
                    },
                    {
                        "key": "egl charitable foundation, new york, ny, usa",
                        "doc_count": 1
                    },
                    {
                        "key": "elixir-excelerate programme, elixir-hub, uk",
                        "doc_count": 1
                    },
                    {
                        "key": "embl-ebi industry programme, embl-ebi, wellcome genome campus, hinxton, cambridgeshire, uk",
                        "doc_count": 1
                    },
                    {
                        "key": "emerald publishing limited, bingley, uk",
                        "doc_count": 1
                    },
                    {
                        "key": "envo",
                        "doc_count": 1
                    },
                    {
                        "key": "eu biosapiens",
                        "doc_count": 1
                    },
                    {
                        "key": "eurenomics",
                        "doc_count": 1
                    },
                    {
                        "key": "euroepinomics, european science foundation",
                        "doc_count": 1
                    },
                    {
                        "key": "european central bank",
                        "doc_count": 1
                    },
                    {
                        "key": "european commision grants felics",
                        "doc_count": 1
                    },
                    {
                        "key": "european commission horizon2020 programme",
                        "doc_count": 1
                    },
                    {
                        "key": "european communitys seventh framework programme",
                        "doc_count": 1
                    },
                    {
                        "key": "european network of excellence",
                        "doc_count": 1
                    },
                    {
                        "key": "european network of excellence (enfin), hinxton, cambridgeshire, uk",
                        "doc_count": 1
                    },
                    {
                        "key": "european regional development fund",
                        "doc_count": 1
                    },
                    {
                        "key": "european science foundation (esf)",
                        "doc_count": 1
                    },
                    {
                        "key": "european union?s horizon 2020 research and innovation programme",
                        "doc_count": 1
                    },
                    {
                        "key": "family hearth international (fhi 360), durham, nc, usa",
                        "doc_count": 1
                    },
                    {
                        "key": "federal ministry of education and research (bmbf), berlin, germany",
                        "doc_count": 1
                    },
                    {
                        "key": "fhi 360",
                        "doc_count": 1
                    },
                    {
                        "key": "forst, new zealand",
                        "doc_count": 1
                    },
                    {
                        "key": "forums for integrative phenomics, nih",
                        "doc_count": 1
                    },
                    {
                        "key": "functional genomics data society (fged)",
                        "doc_count": 1
                    },
                    {
                        "key": "functional genomics data society (fged); minseqe working group",
                        "doc_count": 1
                    },
                    {
                        "key": "functional genomics data society (fged); mo working group",
                        "doc_count": 1
                    },
                    {
                        "key": "functional genomics group, european bioinformatics institute (embl-ebi), wellcome trust genome campus, hinxton, cambridgeshire, uk",
                        "doc_count": 1
                    },
                    {
                        "key": "gen2phen",
                        "doc_count": 1
                    },
                    {
                        "key": "gene ontology consortium",
                        "doc_count": 1
                    },
                    {
                        "key": "genomic standards consortium",
                        "doc_count": 1
                    },
                    {
                        "key": "geo repository",
                        "doc_count": 1
                    },
                    {
                        "key": "german chapter of the international league against epilepsy",
                        "doc_count": 1
                    },
                    {
                        "key": "german research foundation",
                        "doc_count": 1
                    },
                    {
                        "key": "global advances in health and medicine",
                        "doc_count": 1
                    },
                    {
                        "key": "horizon 2020 programme of the european union - embric",
                        "doc_count": 1
                    },
                    {
                        "key": "hp (human phenotype) administrators",
                        "doc_count": 1
                    },
                    {
                        "key": "hugo gene nomenclature committee (hgnc), hinxton, cambridgeshire, uk",
                        "doc_count": 1
                    },
                    {
                        "key": "human proteome organisation, vancouver, bc, canada",
                        "doc_count": 1
                    },
                    {
                        "key": "hupo-psi initiative; quality control working group",
                        "doc_count": 1
                    },
                    {
                        "key": "inchi trust",
                        "doc_count": 1
                    },
                    {
                        "key": "incyte genomics, wilmington, de, usa",
                        "doc_count": 1
                    },
                    {
                        "key": "infocom corporation, tokyo, japan",
                        "doc_count": 1
                    },
                    {
                        "key": "institute of social and preventive medicine (ispm), university of bern, bern, switzerland",
                        "doc_count": 1
                    },
                    {
                        "key": "integrative medicine institute (imi), portland, or, usa",
                        "doc_count": 1
                    },
                    {
                        "key": "international doi foundation",
                        "doc_count": 1
                    },
                    {
                        "key": "international monetary fund (imf), washington d.c., usa",
                        "doc_count": 1
                    },
                    {
                        "key": "international society for pharmacoeconomics and outcomes research (ispor), lawrenceville, nj, usa",
                        "doc_count": 1
                    },
                    {
                        "key": "international union of pure and applied chemistry (iupac)",
                        "doc_count": 1
                    },
                    {
                        "key": "international virtual observatory alliance (ivoa)",
                        "doc_count": 1
                    },
                    {
                        "key": "isa-tools, university of oxford, oxford, uk",
                        "doc_count": 1
                    },
                    {
                        "key": "italian ministry of education, university and research (miur), roma, italy",
                        "doc_count": 1
                    },
                    {
                        "key": "ivoa semantics working group",
                        "doc_count": 1
                    },
                    {
                        "key": "juan de la cierva, madrid, spain",
                        "doc_count": 1
                    },
                    {
                        "key": "lawrence berkeley national laboratory (lbnl), ca, usa",
                        "doc_count": 1
                    },
                    {
                        "key": "maurice wilkins center for molecular biodiscovery, auckland, new zealand",
                        "doc_count": 1
                    },
                    {
                        "key": "metabolomics standards initiative (msi)",
                        "doc_count": 1
                    },
                    {
                        "key": "mimos berhad, kuala lumpur, malaysia",
                        "doc_count": 1
                    },
                    {
                        "key": "minimal information about t cell assays (miata) consortium",
                        "doc_count": 1
                    },
                    {
                        "key": "ministry of education and science of the russian federation, moscow, russia",
                        "doc_count": 1
                    },
                    {
                        "key": "ministry of food and drug safety, south korea",
                        "doc_count": 1
                    },
                    {
                        "key": "ministry of science and technology, beijing, china",
                        "doc_count": 1
                    },
                    {
                        "key": "national aeronautics and space administration (nasa), washington dc, usa",
                        "doc_count": 1
                    },
                    {
                        "key": "national cancer institute, rockville, md, usa",
                        "doc_count": 1
                    },
                    {
                        "key": "national center for advancing translational sciences (ncats), bethesda, md, usa",
                        "doc_count": 1
                    },
                    {
                        "key": "national center for biomedical ontology (ncbo), stanford, ca, usa",
                        "doc_count": 1
                    },
                    {
                        "key": "national center for biotechnology information (ncbi), rockville, md, usa",
                        "doc_count": 1
                    },
                    {
                        "key": "national centre for the replacement, refinement and reduction of animals in research (nc3rs), london, uk",
                        "doc_count": 1
                    },
                    {
                        "key": "national institute of standards & technology (nist)",
                        "doc_count": 1
                    },
                    {
                        "key": "national institutes for health/office of laboratory animal welfare (olaw), bethesda, md, usa",
                        "doc_count": 1
                    },
                    {
                        "key": "national library board (nlb), singapore, singapore",
                        "doc_count": 1
                    },
                    {
                        "key": "national library of finland, helsinki, finland",
                        "doc_count": 1
                    },
                    {
                        "key": "national library of korea, seoul, korea",
                        "doc_count": 1
                    },
                    {
                        "key": "national library of medicine (nlm), bethesda, md, usa",
                        "doc_count": 1
                    },
                    {
                        "key": "natural environment research council (nerc), uk",
                        "doc_count": 1
                    },
                    {
                        "key": "natural science foundation of heilongjiang province, china",
                        "doc_count": 1
                    },
                    {
                        "key": "natural science research project of yongchuan district",
                        "doc_count": 1
                    },
                    {
                        "key": "neuromics",
                        "doc_count": 1
                    },
                    {
                        "key": "nih data commons",
                        "doc_count": 1
                    },
                    {
                        "key": "nzima",
                        "doc_count": 1
                    },
                    {
                        "key": "obi consortium",
                        "doc_count": 1
                    },
                    {
                        "key": "open data institute odi",
                        "doc_count": 1
                    },
                    {
                        "key": "orcid",
                        "doc_count": 1
                    },
                    {
                        "key": "ottawa health research institute",
                        "doc_count": 1
                    },
                    {
                        "key": "parkinson's uk",
                        "doc_count": 1
                    },
                    {
                        "key": "physiome project",
                        "doc_count": 1
                    },
                    {
                        "key": "prisma members",
                        "doc_count": 1
                    },
                    {
                        "key": "rd-connect",
                        "doc_count": 1
                    },
                    {
                        "key": "rdml consortium; miqe working group",
                        "doc_count": 1
                    },
                    {
                        "key": "remark group",
                        "doc_count": 1
                    },
                    {
                        "key": "research data alliance (rda)",
                        "doc_count": 1
                    },
                    {
                        "key": "resource identification initiatve",
                        "doc_count": 1
                    },
                    {
                        "key": "ruhr-universitat bochum",
                        "doc_count": 1
                    },
                    {
                        "key": "sbml community",
                        "doc_count": 1
                    },
                    {
                        "key": "sdmx initiative",
                        "doc_count": 1
                    },
                    {
                        "key": "shanghai library, shanghai, china",
                        "doc_count": 1
                    },
                    {
                        "key": "simmonds - school of library and information science",
                        "doc_count": 1
                    },
                    {
                        "key": "spanish instituto de salud carlos iii instituto nacional de bioinformatica",
                        "doc_count": 1
                    },
                    {
                        "key": "stard initiative",
                        "doc_count": 1
                    },
                    {
                        "key": "statistical office of the european union (eurostat)",
                        "doc_count": 1
                    },
                    {
                        "key": "strega group, faculty of medecine, ottawa, canada",
                        "doc_count": 1
                    },
                    {
                        "key": "strenda commission",
                        "doc_count": 1
                    },
                    {
                        "key": "strobe group",
                        "doc_count": 1
                    },
                    {
                        "key": "swiss national sciences foundation (sncf)",
                        "doc_count": 1
                    },
                    {
                        "key": "the committee on data for science and technology (codata), paris, france",
                        "doc_count": 1
                    },
                    {
                        "key": "the deutsche forschungsgemeinschaft",
                        "doc_count": 1
                    },
                    {
                        "key": "the federal ministry of education and research (bmbf)",
                        "doc_count": 1
                    },
                    {
                        "key": "the gordon and betty moore foundation, usa",
                        "doc_count": 1
                    },
                    {
                        "key": "the information school, university of washington, seattle, wa, usa",
                        "doc_count": 1
                    },
                    {
                        "key": "the monarch initiative",
                        "doc_count": 1
                    },
                    {
                        "key": "the research council of norway",
                        "doc_count": 1
                    },
                    {
                        "key": "the spirit group",
                        "doc_count": 1
                    },
                    {
                        "key": "thermodynamics research center (trc), national institute of standards and technology (nist)",
                        "doc_count": 1
                    },
                    {
                        "key": "trend group",
                        "doc_count": 1
                    },
                    {
                        "key": "u.s. national science foundation",
                        "doc_count": 1
                    },
                    {
                        "key": "uk equator centre, centre for statistics in medicine (cms) university of oxford, oxford, uk",
                        "doc_count": 1
                    },
                    {
                        "key": "united nations statistics division (unsd)",
                        "doc_count": 1
                    },
                    {
                        "key": "universidade estadual paulista - unesp",
                        "doc_count": 1
                    },
                    {
                        "key": "universite de lyon, france",
                        "doc_count": 1
                    },
                    {
                        "key": "university of harvard, ma, usa",
                        "doc_count": 1
                    },
                    {
                        "key": "university of liverpool, uk",
                        "doc_count": 1
                    },
                    {
                        "key": "university of michigan, usa",
                        "doc_count": 1
                    },
                    {
                        "key": "university of modena and emilia-romagna",
                        "doc_count": 1
                    },
                    {
                        "key": "university of southern california (usc), usa",
                        "doc_count": 1
                    },
                    {
                        "key": "university of tsukuba",
                        "doc_count": 1
                    },
                    {
                        "key": "virtual physiological human network of excellence",
                        "doc_count": 1
                    },
                    {
                        "key": "world bank",
                        "doc_count": 1
                    },
                    {
                        "key": "world data system wds",
                        "doc_count": 1
                    }
                ]
            },
            "taxonomies": {
                "doc_count": 74,
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [
                    {
                        "key": "all",
                        "doc_count": 27
                    },
                    {
                        "key": "homo sapiens",
                        "doc_count": 26
                    },
                    {
                        "key": "not applicable",
                        "doc_count": 14
                    },
                    {
                        "key": "archaea",
                        "doc_count": 7
                    },
                    {
                        "key": "bacteria",
                        "doc_count": 7
                    },
                    {
                        "key": "eukaryota",
                        "doc_count": 7
                    },
                    {
                        "key": "mus musculus",
                        "doc_count": 7
                    },
                    {
                        "key": "metazoa",
                        "doc_count": 2
                    },
                    {
                        "key": "algae",
                        "doc_count": 1
                    },
                    {
                        "key": "animalia",
                        "doc_count": 1
                    },
                    {
                        "key": "fungi",
                        "doc_count": 1
                    },
                    {
                        "key": "protozoa",
                        "doc_count": 1
                    },
                    {
                        "key": "viruses",
                        "doc_count": 1
                    }
                ]
            },
            "is_approved": {
                "doc_count": 74,
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [
                    {
                        "key": "true",
                        "key_as_string": "true",
                        "doc_count": 74
                    }
                ]
            },
            "licences": {
                "doc_count": 74,
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [
                    {
                        "key": "creative commons attribution 3.0 unported (cc by 3.0)",
                        "doc_count": 5
                    },
                    {
                        "key": "creative commons attribution 4.0 international (cc by 4.0)",
                        "doc_count": 5
                    },
                    {
                        "key": "creative commons cc0 1.0 universal (cc0 1.0) public domain dedication",
                        "doc_count": 5
                    },
                    {
                        "key": "creative commons attribution-sharealike 4.0 international (cc by-sa 4.0)",
                        "doc_count": 2
                    },
                    {
                        "key": "apache license 2.0",
                        "doc_count": 1
                    },
                    {
                        "key": "attribution required",
                        "doc_count": 1
                    },
                    {
                        "key": "beilstein institute privacy policy",
                        "doc_count": 1
                    },
                    {
                        "key": "bsd-3-clause license (modified bsd license) (new bsd license)",
                        "doc_count": 1
                    },
                    {
                        "key": "cdc privacy policy",
                        "doc_count": 1
                    },
                    {
                        "key": "creative commons attribution 2.0 generic (cc by 2.0)",
                        "doc_count": 1
                    },
                    {
                        "key": "creative commons attribution-noncommercial-noderivs 3.0 united states (cc by-nc-nd 3.0 us)",
                        "doc_count": 1
                    },
                    {
                        "key": "datacite privacy policy",
                        "doc_count": 1
                    },
                    {
                        "key": "datacite terms and conditions",
                        "doc_count": 1
                    },
                    {
                        "key": "doi privacy policy",
                        "doc_count": 1
                    },
                    {
                        "key": "embl-ebi terms of use",
                        "doc_count": 1
                    },
                    {
                        "key": "gnu lesser general public license (lgpl) 3.0",
                        "doc_count": 1
                    },
                    {
                        "key": "hpo license",
                        "doc_count": 1
                    },
                    {
                        "key": "ispor privacy policy",
                        "doc_count": 1
                    },
                    {
                        "key": "iupac/inchi - trust  inchi licence no. 1. 0",
                        "doc_count": 1
                    },
                    {
                        "key": "public domain",
                        "doc_count": 1
                    }
                ]
            },
            "user_defined_tags": {
                "doc_count": 74,
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [
                    {
                        "key": "drug target",
                        "doc_count": 7
                    },
                    {
                        "key": "metadata standardization",
                        "doc_count": 7
                    },
                    {
                        "key": "protein superfamily",
                        "doc_count": 7
                    },
                    {
                        "key": "general purpose",
                        "doc_count": 5
                    },
                    {
                        "key": "data sharing",
                        "doc_count": 4
                    },
                    {
                        "key": "data standards",
                        "doc_count": 2
                    }
                ]
            },
            "status": {
                "doc_count": 74,
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [
                    {
                        "key": "ready",
                        "doc_count": 73
                    },
                    {
                        "key": "deprecated",
                        "doc_count": 1
                    }
                ]
            }
        },
        "currentPage": 1,
        "perPage": 30,
        "totalCount": 74,
        "totalPages": 3,
        "firstPage": true,
        "records": [
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {}
        ]
    };
    let state = {
        records: [],
        facets: [],
        totalPages: null,
        hits: null,
        loading: false
    };
    actions.commit = jest.fn();

    it("can check fetchRecords actions", () => {
        const params = {
            fairsharingRegistry: "Standard",
            isRecommended: true
        };
        actions.fetchRecords(state, params);
        expect(actions.commit).toHaveBeenCalledTimes(3);

        actions.commit = null;
        actions.commit = jest.fn();
        actions.fetchRecords(state, {});
        expect(actions.commit).toHaveBeenCalledTimes(3);
    });

    it("can check resetRecords actions", () => {
        actions.resetRecords();
        expect(actions.commit).toHaveBeenCalledTimes(4);
    });

    it("can check setRecords mutations", () => {
        mutations.setRecords(state, returnedVal);
        expect(state.records.length).toBeGreaterThan(0);
    });

    it("can check resetRecords mutations", () => {
        mutations.resetRecords(state);
        expect(state.records.length).toBe(0);
    });

    it("can check resetHits mutations", () => {
        mutations.resetHits(state);
        expect(state.hits).toBe(null);
    });

    it("can check setLoadingStatus mutations", () => {
        const status = true;
        mutations.setLoadingStatus(state, status);
        expect(state.loading).toBe(true);
    });

    it("can check buildFacets function", () => {
        const returnedVal_NewKey = {
            "searchFairsharingRecords": {
                "aggregations": {
                    "is_maintained": {
                        "meta": {},
                        "doc_count": 3053,
                        "doc_count_error_upper_bound": 0,
                        "sum_other_doc_count": 0,
                        "buckets": [
                            {
                                "key": 0,
                                "key_as_string": "false",
                                "doc_count": 1670
                            },
                            {
                                "key": 1,
                                "key_as_string": "true",
                                "doc_count": 1383
                            }
                        ]
                    },
                    "grants": {
                        "meta": {},
                        "doc_count": 3053,
                        "doc_count_error_upper_bound": 0,
                        "sum_other_doc_count": 191,
                        "buckets": [
                            {
                                "key": "xda08020102",
                                "doc_count": 9
                            },
                            {
                                "key": "2014aa021503 and 2015aa020108",
                                "doc_count": 8
                            },
                        ]
                    },
                    "fairsharing_registry": {
                        "meta": {},
                        "doc_count": 3053,
                        "doc_count_error_upper_bound": 0,
                        "sum_other_doc_count": 0,
                        "buckets": [
                            {
                                "key": "database",
                                "doc_count": 1465
                            },
                            {
                                "key": "standard",
                                "doc_count": 1409
                            },
                            {
                                "key": "policy",
                                "doc_count": 133
                            },
                            {
                                "key": "collection",
                                "doc_count": 46
                            }
                        ]
                    },
                    "subjects": {
                        "meta": {},
                        "doc_count": 3053,
                        "doc_count_error_upper_bound": 0,
                        "sum_other_doc_count": 0,
                        "buckets": [
                            {
                                "key": "natural science",
                                "doc_count": 2403
                            },
                            {
                                "key": "natural sciences",
                                "doc_count": 2395
                            },
                        ]
                    },
                    "domains": {
                        "meta": {},
                        "doc_count": 3053,
                        "doc_count_error_upper_bound": 0,
                        "sum_other_doc_count": 588,
                        "buckets": [
                            {
                                "key": "entity",
                                "doc_count": 2324
                            },
                            {
                                "key": "continuant",
                                "doc_count": 2106
                            },
                        ]
                    },
                    "countries": {
                        "meta": {},
                        "doc_count": 3053,
                        "doc_count_error_upper_bound": 0,
                        "sum_other_doc_count": 0,
                        "buckets": [
                            {
                                "key": "united states of america",
                                "doc_count": 1174
                            },
                            {
                                "key": "united kingdom of great britain and northern ireland",
                                "doc_count": 558
                            },
                            {
                                "key": "germany",
                                "doc_count": 284
                            },
                        ]
                    },
                    "journals": {
                        "meta": {},
                        "doc_count": 3053,
                        "doc_count_error_upper_bound": 0,
                        "sum_other_doc_count": 0,
                        "buckets": [
                            {
                                "key": "nucleic acids res",
                                "doc_count": 418
                            }
                        ]
                    },
                    "record_type": {
                        "meta": {},
                        "doc_count": 3053,
                        "doc_count_error_upper_bound": 0,
                        "sum_other_doc_count": 0,
                        "buckets": [
                            {
                                "key": "repository",
                                "doc_count": 1465
                            },
                            {
                                "key": "terminology_artefact",
                                "doc_count": 780
                            },
                            {
                                "key": "model_and_format",
                                "doc_count": 414
                            },
                            {
                                "key": "reporting_guideline",
                                "doc_count": 170
                            },
                            {
                                "key": "journal",
                                "doc_count": 85
                            },
                            {
                                "key": "collection",
                                "doc_count": 46
                            },
                            {
                                "key": "metric",
                                "doc_count": 30
                            },
                            {
                                "key": "society",
                                "doc_count": 25
                            },
                            {
                                "key": "funder",
                                "doc_count": 23
                            },
                            {
                                "key": "identifier_schema",
                                "doc_count": 15
                            }
                        ]
                    },
                    "is_recommended": {
                        "meta": {},
                        "doc_count": 3053,
                        "doc_count_error_upper_bound": 0,
                        "sum_other_doc_count": 0,
                        "buckets": [
                            {
                                "key": 0,
                                "key_as_string": "false",
                                "doc_count": 2741
                            },
                            {
                                "key": 1,
                                "key_as_string": "true",
                                "doc_count": 312
                            }
                        ]
                    },
                    "organisations": {
                        "meta": {},
                        "doc_count": 3053,
                        "doc_count_error_upper_bound": 0,
                        "sum_other_doc_count": 1886,
                        "buckets": [
                            {
                                "key": "national institutes of health (nih), bethesda, md, usa",
                                "doc_count": 296
                            },
                            {
                                "key": "national science foundation (nsf), usa",
                                "doc_count": 277
                            },
                        ]
                    },
                    "taxonomies": {
                        "meta": {},
                        "doc_count": 3053,
                        "doc_count_error_upper_bound": 0,
                        "sum_other_doc_count": 0,
                        "buckets": [
                            {
                                "key": "all",
                                "doc_count": 1217
                            },
                            {
                                "key": "homo sapiens",
                                "doc_count": 707
                            },
                            {
                                "key": "not applicable",
                                "doc_count": 487
                            },
                        ]
                    },
                    "is_approved": {
                        "meta": {},
                        "doc_count": 3053,
                        "doc_count_error_upper_bound": 0,
                        "sum_other_doc_count": 0,
                        "buckets": [
                            {
                                "key": 1,
                                "key_as_string": "true",
                                "doc_count": 3037
                            },
                            {
                                "key": 0,
                                "key_as_string": "false",
                                "doc_count": 16
                            }
                        ]
                    },
                    "licences": {
                        "meta": {},
                        "doc_count": 3053,
                        "doc_count_error_upper_bound": 0,
                        "sum_other_doc_count": 0,
                        "buckets": [
                            {
                                "key": "creative commons attribution 4.0 international (cc by 4.0)",
                                "doc_count": 261
                            },
                            {
                                "key": "attribution required",
                                "doc_count": 143
                            },
                        ]
                    },
                    "user_defined_tags": {
                        "meta": {},
                        "doc_count": 3053,
                        "doc_count_error_upper_bound": 0,
                        "sum_other_doc_count": 0,
                        "buckets": [
                            {
                                "key": "general purpose",
                                "doc_count": 199
                            },
                            {
                                "key": "data sharing",
                                "doc_count": 178
                            },
                            {
                                "key": "metadata standardization",
                                "doc_count": 150
                            },
                        ]
                    },
                    "status": {
                        "meta": {},
                        "doc_count": 3053,
                        "doc_count_error_upper_bound": 0,
                        "sum_other_doc_count": 0,
                        "buckets": [
                            {
                                "key": "ready",
                                "doc_count": 2715
                            },
                            {
                                "key": "deprecated",
                                "doc_count": 143
                            },
                            {
                                "key": "uncertain",
                                "doc_count": 135
                            },
                            {
                                "key": "in_development",
                                "doc_count": 60
                            }
                        ]
                    },
                    "notAvailableKey!": {}
                }
            }
        };
        let aggregation = returnedVal_NewKey['searchFairsharingRecords']['aggregations']
        const new_rawFilters = buildFacets(aggregation);
        expect(state.facets.length).toBe(new_rawFilters.length);
    });

    it("can check getFilters getters", () => {
        let BuiltFacet = getters.getFilter(state)('grants');
        expect(BuiltFacet.filterName).toBe('grants')

        state.facets = [];
        BuiltFacet = getters.getFilter(state)('grants');
        expect(BuiltFacet.filterName).toBe(undefined)
    });

});
