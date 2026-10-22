import { NextRequest, NextResponse } from "next/server";

const LARAVEL =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8000";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth_token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.formData();
    const headers = new Headers({ Accept: "application/json" });
    headers.set("Authorization", ["Bearer", token].join(" "));
    const res = await fetch(`${LARAVEL}/api/admin/news-events/upload-chunk`, {
      method: "POST",
      headers,
      body,
    });

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { error: `Upstream error (${res.status})` },
        { status: res.status },
      );
    }
    return NextResponse.json(await res.json(), { status: res.status });
  } catch (err) {
    console.error("[admin/news-events/upload-chunk POST]", err);
    return NextResponse.json(
      { error: "Failed to upload image chunk" },
      { status: 500 },
    );
  }
}
