import { redirect } from "next/navigation";

export default function RootPage() {
  // Direkt auf das Deckblatt weiterleiten (Default-Locale ohne Prefix)
  redirect("/chapters/cover");
}
