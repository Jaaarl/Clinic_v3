import mongoose from 'mongoose';
import { Schema } from mongoose;

const QueueSchema = new Schema({
    referenceId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'ReferencedModel' // Optional: replace 'ReferencedModel' with the name of the model you're referencing
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Queue = mongoose.models.Queue || mongoose.model('Queue', QueueSchema);

export default Queue;
