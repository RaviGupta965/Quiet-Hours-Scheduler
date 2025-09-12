import { Schema, Document, models, model } from "mongoose"

export interface ISlot extends Document {
  title: string
  startTime: Date
  endTime: Date
  email: string
  reminderSent: boolean
}

const slotSchema = new Schema<ISlot>({
  title: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  email: { type: String, required: true },
  reminderSent: { type: Boolean, default: false }
})

const Slot = models.Slot || model<ISlot>("Slot", slotSchema)

export default Slot