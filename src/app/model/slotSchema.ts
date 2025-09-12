import mongoose from 'mongoose'

const slotSchema = new mongoose.Schema({
    title: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    email: { type: String, required: true },
    reminderSent: {type: Boolean, default: false}
})

export default mongoose.models.Slot || mongoose.model("Slot", slotSchema);