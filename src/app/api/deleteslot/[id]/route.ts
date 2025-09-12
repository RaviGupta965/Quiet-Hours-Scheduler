import { connectDB } from "@/app/lib/connectDB";
import { NextRequest, NextResponse } from "next/server";
import Slot from "@/app/model/slotSchema";

export async function DELETE(
  req: NextRequest,
  context: { params: Record<string, string> }
) {
  try {
    await connectDB();

    const id = context.params.id;
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const slot = await Slot.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Slot deleted successfully", slot },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
