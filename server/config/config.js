
// =================================
//  Configuraciones
// ================================

// process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// let BD = ''

// if(process.env.NODE_ENV === 'dev'){
//     BD = 'mongodb://localhost:27017/cafe';
//     process.env.MOGNODB_URI = BD;
// }else{
//     BD = 'mongodb+srv://db_user_sky:1llD1UgBueud8bAj@cluster0-b0vhf.mongodb.net/cafe';
//     process.env.MOGNODB_URI = BD;
// }

// const config = {
//     dbUrl: process.env.MOGNODB_URI,
//     port: process.env.PORT || 3000,
//     host: process.env.HOST || 'http://localhost',
//     // publicRoute: process.env.PUBLIC_ROUTE || '/app',
//     // filesRoute: process.env.FILES_ROUTE || 'files',
// };

process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// mongodb+srv://<db_user_sky>:<1llD1UgBueud8bAj>@cluster0-b0vhf.mongodb.net/cafe?retryWrites=true&w=majority

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    // urlDB = 'mongodb+srv://<db_user_sky>:<1llD1UgBueud8bAj>@cluster0-b0vhf.mongodb.net/cafe'
    urlDB = 'mongodb+srv://db_user_sky:1llD1UgBueud8bAj@cluster0-b0vhf.mongodb.net/cafe?retryWrites=true&w=majority';
}

process.env.URLDB = urlDB;

// module.exports = config;