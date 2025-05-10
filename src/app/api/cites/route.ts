import { NextResponse } from "next/server";
import data from "@/utility/in.json";

export async function POST(req: Request) {
  try {
    // Parse the request body (if needed)
    const body = await req.json();

    // Example: Filter cities based on a query from the request body
    // const filteredCities = data.filter((city) =>
    //   city.city.toLowerCase().includes(body.query.toLowerCase())
    // );

    // Return the filtered data
    return NextResponse.json(body);
  } catch (error) {
    console.error("Error in POST /api/cites:", error);
    return NextResponse.json(
      { error: "Failed to process the request" },
      { status: 500 }
    );
  }
}