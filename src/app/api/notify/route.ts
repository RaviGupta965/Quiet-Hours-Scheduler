import { NextResponse } from "next/server"
import { connectDB } from "@/app/lib/connectDB"
import Slot from "@/app/model/slotSchema"
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
})

export async function GET() {
  try {
    await connectDB()

    const now = new Date()
    const tenMinutesLater = new Date(now.getTime() + 10 * 60 * 1000)

    // ignore seconds by rounding
    const start = new Date(
      tenMinutesLater.getFullYear(),
      tenMinutesLater.getMonth(),
      tenMinutesLater.getDate(),
      tenMinutesLater.getHours(),
      tenMinutesLater.getMinutes(),
      0,
      0
    )
    const end = new Date(start.getTime() + 60 * 1000) // 1-minute window

    const slots = await Slot.find({
      startTime: { $gte: start, $lt: end }
    })

    for (const slot of slots) {
      await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: slot.email,
        subject: `Reminder: "${slot.title}" starts soon`,
        text: `Hello, your study slot "${slot.title}" starts at ${slot.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      })
    }

    return NextResponse.json({ success: true, count: slots.length })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
     return NextResponse.json({ error: message }, { status: 500 });
  }
}