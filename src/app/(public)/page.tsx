import { redirect } from "next/navigation";
import { loadSiteConfig } from "@/lib/content/loader";

/**
 * Root route — redirects to the default persona.
 * The default persona is set in content/site.json.
 * Changing the default is a one-line JSON edit.
 */
export default function RootPage() {
  const site = loadSiteConfig();
  redirect(`/${site.defaultPersona}`);
}
