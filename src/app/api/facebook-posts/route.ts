import { NextResponse } from "next/server";

const PAGE_ID = process.env.FB_PAGE_ID!;
const PAGE_TOKEN = process.env.FB_PAGE_TOKEN!;

// 10 минут кэша на уровне Next (ISR для fetch)
export const revalidate = 600;

const FIELDS = [
  "id",
  "permalink_url",
  "message",
  "created_time",
  "full_picture",
  // attachments: для альбомов/линков/видео, subattachments — фото-галерея
  "attachments{media_type,media,unshimmed_url,url,target,subattachments}",
].join(",");

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const after = searchParams.get("after"); // для пагинации курсором

    const url = new URL(`https://graph.facebook.com/v20.0/${PAGE_ID}/posts`);
    url.searchParams.set("fields", FIELDS);
    url.searchParams.set("access_token", PAGE_TOKEN);
    url.searchParams.set("limit", "6");
    if (after) url.searchParams.set("after", after);

    const fbRes = await fetch(url.toString(), { next: { revalidate } });
    if (!fbRes.ok) {
      const text = await fbRes.text();
      return NextResponse.json({ error: text }, { status: fbRes.status });
    }
    const data = await fbRes.json();
    return NextResponse.json(data, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "FB fetch error" },
      { status: 500 },
    );
  }
}
