var fs = require('fs');

function ImageHelper(_path) {
}

ImageHelper.prototype.uploadImage = (obj) => {
  try {
    // to declare some path to store your converted image
    const path = `./public/images/images/${Date.now()}-${obj.filename}`

    const imgdata = obj.encode;

    // to convert base64 format into random filename
    const base64Data = imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, '');

    fs.writeFileSync(path, base64Data, { encoding: 'base64' });

    return path
  } catch (e) {
    throw e
  }
}

module.exports = ImageHelper;