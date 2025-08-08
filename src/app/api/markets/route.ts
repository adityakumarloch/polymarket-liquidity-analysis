import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Build the query parameters
    const params = new URLSearchParams({
      active: searchParams.get("active") || "true",
      archived: searchParams.get("archived") || "false",
      closed: searchParams.get("closed") || "false",
      liquidity_num_min: searchParams.get("liquidity_num_min") || "100000",
    });

    const url = `https://gamma-api.polymarket.com/markets?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching market data:", error);
    return NextResponse.json(
      { error: "Failed to fetch market data" },
      { status: 500 }
    );
  }
}
