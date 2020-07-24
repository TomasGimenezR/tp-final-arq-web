const mongoose = require('mongoose')

const fileSchema = new mongoose.Schema ({
    name: {
        type: String,
        default: 'Nuevo archivo adjunto'
    },
    file: {
        type: Buffer,
        required: true
    },
    date: {
        type: Date,
        default: new Date()
    }
})

const Folder = mongoose.model('File', fileSchema)

module.exports = File