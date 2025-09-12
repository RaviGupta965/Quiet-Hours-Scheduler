import { connectDB } from "@/app/lib/connectDB";
import { NextRequest, NextResponse } from "next/server";
import Slot from "@/app/model/slotSchema";
// POST request handler
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = await params;

    const slot = await Slot.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "Slots deleted successfully", slot },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
