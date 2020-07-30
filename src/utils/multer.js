const multer = require('multer')

// Set The Storage Engine
const storage = multer.diskStorage({
    destination: '../../public/files',
    filename: function(req, file, cb){
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  
  // Init Upload
  const upload = multer({
    storage,
    limits:{fileSize: 1000000}
  }).single('myImage');//.array('file')

module.exports = upload