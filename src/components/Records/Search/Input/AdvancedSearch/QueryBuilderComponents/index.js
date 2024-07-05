
export const StandardRecordType = () =>
  import("./RecordTypes/StandardRecordType.vue");
export const PolicyRecordType = () =>
  import("./RecordTypes/PolicyRecordType.vue");
export const Registry = () => import("./Registry.vue");
export const Subject = () => import("./Subject.vue");
export const UserDefinedTag = () => import("./UserDefinedTag.vue");
export const Domain = () => import("./Domains.vue");
export const RecordStatus = () => import("./RecordStatus.vue");

export const Taxonomies = () => import("./Taxonomies.vue");

export const Licences = () => import("./Licences.vue");
export const Organisations = () => import("./Organisations.vue");
export const Countries = () => import("./Countries.vue")
export const GroupCtrlSlot = () => import("./GroupCtrlSlot/GroupCtrlSlot.vue")
export const DatabaseRecordType = () =>
  import("./DatabaseComponents/DatabaseRecordType.vue");
export const DataCuration = () => import("./DatabaseComponents/DataCuration.vue");
export const DataDepositionCondition = () =>
  import("./DatabaseComponents/DataDepositionCondition.vue");
export const DataAccessCondition = () => import("./DatabaseComponents/DataAccessCondition.vue");
export const CitationToRelatedPublications = () => import("./DatabaseComponents/CitationToRelatedPublications.vue");
export const DataAccessForPrePublicationReview = () => import("./DatabaseComponents/DataAccessForPrePublicationReview.vue");
export const DataContactInformation = () => import("./DatabaseComponents/DataContactInformation.vue");
export const DataVersioning = () => import("./DatabaseComponents/DataVersioning.vue");
export const AssociatedTools = () => import("./DatabaseComponents/AssociatedTools.vue");
