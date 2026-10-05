// File location: app/api/admin/news-events/events/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

const LARAVEL =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8000";

type Ctx = { params: Promise<{ id: string }> };

async function proxyJson(res: Response): Promise<NextResponse> {
  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json(
      { error: `Upstream error (${res.status})` },
      { status: res.status },
    );
  }
  return NextResponse.json(await res.json(), { status: res.status });
}

function target(id: string) {
  return `${LARAVEL}/api/admin/news-events/events/${encodeURIComponent(id)}`;
}

// GET one
export async function GET(req: NextRequest, { params }: Ctx) {
  try {
    const token = req.cookies.get("auth_token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const res = await fetch(target(id), {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    return proxyJson(res);
  } catch (err) {
    console.error("[admin/news-events/events/[id] GET]", err);
    return NextResponse.json(
      { error: "Failed to connect to API" },
      { status: 500 },
    );
  }
}

// POST = update (multipart, may include a new image)
export async function POST(req: NextRequest, { params }: Ctx) {
  try {
    const token = req.cookies.get("auth_token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.formData();
    const res = await fetch(target(id), {
      method: "POST",
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      body,
    });
    return proxyJson(res);
  } catch (err) {
    console.error("[admin/news-events/events/[id] POST]", err);
    return NextResponse.json(
      { error: "Failed to connect to API" },
      { status: 500 },
    );
  }
}

// DELETE
export async function DELETE(req: NextRequest, { params }: Ctx) {
  try {
    const token = req.cookies.get("auth_token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const res = await fetch(target(id), {
      method: "DELETE",
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    });
    return proxyJson(res);
  } catch (err) {
    console.error("[admin/news-events/events/[id] DELETE]", err);
    return NextResponse.json(
      { error: "Failed to connect to API" },
      { status: 500 },
    );
  }
}
