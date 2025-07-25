const mongoose = require('mongoose');

const allRoadMapsSchema = mongoose.Schema({
    topic: {
        type: String,
        required: true,
    },
    roadmap: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("allroadmapsmodel", allRoadMapsSchema);