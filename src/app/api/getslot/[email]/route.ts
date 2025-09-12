import { connectDB } from "@/app/lib/connectDB";
import { NextRequest, NextResponse } from "next/server";
import Slot from "@/app/model/slotSchema";
// POST request handler
export async function GET(
  req: NextRequest,
  { params }: { params: { email: string } }
) {
  try {
    await connectDB();
    const { email } = await params;

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
