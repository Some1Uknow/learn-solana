import { contentsData } from "@/data/contents-data";
import { generateModuleOgImage } from "@/lib/og/module";
import { createCanonical } from "@/lib/seo";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

type Params = { moduleId: string };

export async function GET(
  _request: Request,
  { params }: { params: Promise<Params> }
) {
  const { moduleId } = await params;
  const module = contentsData.modules.find((item) => item.id === moduleId);

  if (!module) {
    return new Response("Module not found", { status: 404 });
  }

  const logoUrl = module.image.startsWith("http")
    ? module.image
    : createCanonical(module.image);

  return generateModuleOgImage({
    title: module.title,
    description: module.description,
    logoUrl,
    eyebrow: "Learning path",
  });
}
