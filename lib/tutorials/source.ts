import { loader } from "fumadocs-core/source";
import { tutorials as tutorialsDocs } from "@/.source";

export const tutorialsSource = loader({
  baseUrl: "/tutorials",
  source: tutorialsDocs.toFumadocsSource(),
});
