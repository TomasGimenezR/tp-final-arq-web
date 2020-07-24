const mongoose = require('mongoose')

const folderSchema = new mongoose.Schema ({
    name: {
        type: String,
        default: 'Nueva carpeta'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }

})

const Folder = mongoose.model('Folder', folderSchema)

module.exports = Folder