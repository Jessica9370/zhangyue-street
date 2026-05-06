import { PhotoEntry } from "./types";
import { getAllStreetPhotos } from "./feishu";

// TTL-based cache: allows ISR revalidation to get fresh data
let cache: { data: PhotoEntry[]; timestamp: number } | null = null;
const CACHE_TTL = 30_000; // 30 seconds — shorter than ISR revalidate interval

async function loadPhotos(): Promise<PhotoEntry[]> {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return cache.data;
  }
  const data = await getAllStreetPhotos();
  cache = { data, timestamp: Date.now() };
  return data;
}

// For build-time SSG without env vars (e.g., lint/syntax check), return empty
function noopFallback<T>(val: T): T {
  return val;
}

export async function getAllPhotos(): Promise<PhotoEntry[]> {
  if (!process.env.FEISHU_APP_ID) return noopFallback([]);
  return loadPhotos();
}

export async function getFeaturedPhoto(): Promise<PhotoEntry | null> {
  if (!process.env.FEISHU_APP_ID) return noopFallback(null);
  const photos = await loadPhotos();
  const featured = photos
    .filter((p) => p.featured && p.date)
    .sort((a, b) => b.date.localeCompare(a.date));
  return featured[0] ?? photos[0] ?? null;
}

export async function getPhotoById(id: string): Promise<PhotoEntry | undefined> {
  if (!process.env.FEISHU_APP_ID) return noopFallback(undefined);
  const photos = await loadPhotos();
  return photos.find((p) => p.id === id);
}

export async function getPhotosByDistrict(district: string): Promise<PhotoEntry[]> {
  const photos = await loadPhotos();
  return photos.filter((p) => p.location.district === district);
}

export async function getPhotosBySeason(season: string): Promise<PhotoEntry[]> {
  const photos = await loadPhotos();
  return photos.filter((p) => p.season === season);
}

export async function getRelatedPhotos(photo: PhotoEntry, count = 4): Promise<PhotoEntry[]> {
  const photos = await loadPhotos();
  return photos
    .filter(
      (p) =>
        p.id !== photo.id &&
        (p.location.district === photo.location.district ||
          p.tags.some((t) => photo.tags.includes(t)))
    )
    .slice(0, count);
}

/**
 * Return the latest N photos sorted by date descending.
 * Used to limit the frontend to the most recent entries.
 */
export async function getLatestPhotos(limit = 20): Promise<PhotoEntry[]> {
  const photos = await loadPhotos();
  return photos
    .filter((p) => p.date) // only entries with a valid date
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}
