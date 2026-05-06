import { getLatestPhotos } from "@/lib/photos";
import ArchiveClient from "./ArchiveClient";

// ISR: re-generate at most once every 60 seconds
export const revalidate = 60;

export default async function ArchivePage() {
  const allPhotos = await getLatestPhotos(30);

  return <ArchiveClient allPhotos={allPhotos} />;
}
