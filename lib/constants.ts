import { generateDummyPassword } from "./db/utils";

export const isProductionEnvironment = process.env.NODE_ENV === "production";
export const isDevelopmentEnvironment = process.env.NODE_ENV === "development";
export const isTestEnvironment = Boolean(
  process.env.PLAYWRIGHT_TEST_BASE_URL ||
    process.env.PLAYWRIGHT ||
    process.env.CI_PLAYWRIGHT
);

export const guestRegex = /^guest-\d+$/;

export const DUMMY_PASSWORD = generateDummyPassword();

export const suggestions = [
  "Analyze this RNA-seq dataset for differential expression. Please generate Volcano and MA plots, and summarize the key biological findings in a structured report.",
  "Perform a differential expression analysis on the CD8+ T-cell population between the pre- and post-treatment groups. Please identify significant DEGs and visualize the results using a volcano plot.",
];
