// pages/api/cities.ts

import data from "@/utility/in.json"; 

export async function GET() {
  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
