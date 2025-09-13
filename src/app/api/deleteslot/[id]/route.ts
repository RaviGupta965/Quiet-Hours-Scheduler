import { connectDB } from "@/app/lib/connectDB";
import { NextRequest, NextResponse } from "next/server";
import Slot from "@/app/model/slotSchema";
import { Types } from "mongoose";

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const url = req.nextUrl;

    // Example: /api/deleteslot/123
    const id = url.pathname.split("deleteslot/")[1];
    console.log(id);

    const slot = await Slot.findByIdAndDelete(new Types.ObjectId(id));

    return NextResponse.json(
      { message: "Slot deleted successfully", slot },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
