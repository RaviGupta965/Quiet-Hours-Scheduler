import { connectDB } from "@/app/lib/connectDB";
import { NextRequest, NextResponse } from "next/server";
import Slot from "@/app/model/slotSchema";
// POST request handler
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { title, startTime, endTime, email } = body;

    if (!title || !startTime || !endTime) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const slot = await Slot.create({
      title,
      startTime,
      endTime,
      email,
    });
    await slot.save();

    return NextResponse.json(
      { message: "Slot added successfully", slot },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
     return NextResponse.json({ error: message }, { status: 500 });
  }
}
