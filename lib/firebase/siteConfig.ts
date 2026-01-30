import { DbCollections } from "../constants/dbCollections";
import { getById } from "./firestore";

export const siteConfigStore = {
  getSiteConfig: async (docId = "default") => {
    return await getById<SiteConfig>(DbCollections.SITE_CONFIG, docId);
  },
};
