
// =================================
//  Configuraciones
// ================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let BD = ''

if(process.env.NODE_ENV === 'dev'){
    process.env.MONGO_URI = 'mongodb://localhost:27017/cafe';
}else{
    process.env.MONGO_URI = 'mongodb+srv://db_user_sky:1llD1UgBueud8bAj@cluster0-b0vhf.mongodb.net/cafe';
}

/////////////////////////////////////
// Vencimiento del token
////////////////////////////////////
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
/////////////////////////////////////////
// SEED de autenticacion
/////////////////////////////////////////
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';
// Configuraciones globales
const config = {
    entorno: process.env.NODE_ENV || 'dev',
    dbUrl: process.env.MONGO_URI,
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'http://localhost',
    // publicRoute: process.env.PUBLIC_ROUTE || '/app',
    // filesRoute: process.env.FILES_ROUTE || 'files',
};

///////////////////////////////
/////// Google Client ID -25-12-2019
/////////////////////////////////

process.env.CLIENT_ID = process.env.CLIENT_ID || "735872792975-mqpeph9ia3tvp98o1folegui491s2bs3.apps.googleusercontent.com";

module.exports = config;