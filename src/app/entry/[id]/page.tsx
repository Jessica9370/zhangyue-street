import { notFound } from "next/navigation";
import { getAllPhotos, getPhotoById, getRelatedPhotos } from "@/lib/photos";
import EntryContent from "./EntryContent";

// ISR: re-generate at most once every 60 seconds; allow new entries on-demand
export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const photos = await getAllPhotos();
  return photos.map((photo) => ({ id: photo.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const photo = await getPhotoById(id);
  if (!photo) return { title: "未找到" };
  return {
    title: photo.title,
    description: photo.description,
    openGraph: {
      title: photo.title,
      description: photo.description,
      images: [{ url: photo.image.src }],
    },
  };
}

export default async function EntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const photo = await getPhotoById(id);
  if (!photo) notFound();

  const [allPhotos, related] = await Promise.all([
    getAllPhotos(),
    getRelatedPhotos(photo),
  ]);

  const currentIndex = allPhotos.findIndex((p) => p.id === id);

  return (
    <EntryContent
      photo={photo}
      allPhotos={allPhotos}
      currentIndex={currentIndex}
      related={related}
    />
  );
}
