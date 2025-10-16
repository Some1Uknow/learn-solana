import { loader } from "fumadocs-core/source";
import { challenges as challengesDocs } from "@/.source";

export const challengesSource = loader({
  baseUrl: "/challenges",
  source: challengesDocs.toFumadocsSource(),
});
