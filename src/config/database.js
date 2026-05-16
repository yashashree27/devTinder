const mongoose = require('mongoose');


//cluster : ongodb+srv://namastedev:namastedev@namastenode.7bibinv.mongodb.net/
//database : ongodb+srv://namastedev:namastedev@namastenode.7bibinv.mongodb.net/devTinder
const connectDB = async () => {
    await mongoose.connect('mongodb+srv://namastedev:namastedev@namastenode.7bibinv.mongodb.net/devTinder');
}

module.exports =  connectDB ;
