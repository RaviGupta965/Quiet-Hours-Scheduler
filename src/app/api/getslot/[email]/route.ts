import { connectDB } from "@/app/lib/connectDB";
import { NextRequest, NextResponse } from "next/server";
import Slot from "@/app/model/slotSchema";
// POST request handler
export async function GET(
  req: NextRequest,
) {
  try {
    await connectDB();
    const url = req.nextUrl;

    // Example: /api/deleteslot/123
    const email = url.pathname.split("getslot/")[1];

    const slots = await Slot.find({ email }).sort({ startTime: 1 });

    return NextResponse.json(
      { message: "Slots fetched successfully", slots },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
