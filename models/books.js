var mongoose = require('mongoose');

module.exports = mongoose.model('Book',{
    title: String,
    author: String,
    price: String,
    photolink: String,
    user : String,
});

/*// our model
var A = mongoose.model('A', schema, photoinfo);


    // store an img in binary in mongo
    var a = new A;
    a.img.data = fs.readFileSync(imgPath);
    a.img.contentType = 'image/png';
    a.save(function (err, a) {
      if (err) throw err;

      console.error('saved img to mongo');
module.exports = mongoose.model('Books',{
    title: String,
    author: String,
    price: String,
    photo: File
    String newFileName = "mkyong-java-image";
	File imageFile = new File("c:\\JavaWebHosting.png");
	GridFS gfsPhoto = new GridFS(db, "photo");
	GridFSInputFile gfsFile = gfsPhoto.createFile(imageFile);
	gfsFile.setFilename(newFileName);
	gfsFile.save();
});*/