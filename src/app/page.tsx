import { getLatestPhotos, getFeaturedPhoto } from "@/lib/photos";
import HomeClient from "./HomeClient";

// ISR: re-generate at most once every 60 seconds when a request comes in
export const revalidate = 60;

export default async function HomePage() {
  const [featured, latestPhotos] = await Promise.all([
    getFeaturedPhoto(),
    getLatestPhotos(20),
  ]);

  return <HomeClient featured={featured} photos={latestPhotos} />;
}
