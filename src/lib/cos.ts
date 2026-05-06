/**
 * COS cleanup utility.
 *
 * Keeps only the latest N photos in Tencent COS by deleting old images.
 * Run manually or via cron: npx ts-node -e "import('./cos').then(m => m.cleanOldPhotos(30))"
 *
 * Requires env vars:
 *   COS_SECRET_ID, COS_SECRET_KEY, COS_BUCKET, COS_REGION
 */
import COS from "cos-nodejs-sdk-v5";
import { getAllPhotos } from "./photos";

const SecretId = process.env.COS_SECRET_ID!;
const SecretKey = process.env.COS_SECRET_KEY!;
const Bucket = process.env.COS_BUCKET || "your-bucket-name";
const Region = process.env.COS_REGION || "ap-beijing";

const cos = new COS({ SecretId, SecretKey });

/** Extract the object key (filename) from a COS URL */
function extractKey(url: string): string | null {
  try {
    const u = new URL(url);
    return u.pathname.replace(/^\//, ""); // strip leading /
  } catch {
    return null;
  }
}

/**
 * Delete old COS objects, keeping only the `keepCount` most recent photos.
 */
export async function cleanOldPhotos(keepCount = 30) {
  const allPhotos = await getAllPhotos();

  const withKey = allPhotos
    .map((p) => ({ ...p, cosKey: extractKey(p.image.src) }))
    .filter((p) => p.cosKey);

  // Sort newest-first, keep first keepCount, delete the rest
  const sorted = withKey.sort((a, b) => b.date.localeCompare(a.date));
  const toDelete = sorted.slice(keepCount);

  if (toDelete.length === 0) {
    console.log(`✓ 只有 ${sorted.length} 张图片，无需清理（上限 ${keepCount}）`);
    return;
  }

  console.log(`→ 需删除 ${toDelete.length} 张旧图片`);

  for (const photo of toDelete) {
    try {
      await cos.deleteObject({
        Bucket,
        Region,
        Key: photo.cosKey!,
      });
      console.log(`  ✓ 已删除: ${photo.cosKey} (${photo.date})`);
    } catch (err: any) {
      console.error(`  ✗ 删除失败: ${photo.cosKey}`, err.message);
    }
  }

  console.log(`✓ 清理完成，保留 ${keepCount} 张，删除 ${toDelete.length} 张`);
}

// Allow running directly: node -r ts-node/register -e "require('./cos').cleanOldPhotos(30)"
if (require.main === module) {
  cleanOldPhotos(30).catch(console.error);
}
