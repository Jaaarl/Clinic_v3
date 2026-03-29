const mongoose = require('mongoose');
const { Schema } = mongoose;

const QueueNumSchema = new Schema({
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const QueueNum = mongoose.models.QueueNum || mongoose.model('QueueNum', QueueNumSchema);

module.exports = QueueNum;
