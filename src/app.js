const express = require('express');
const path = require('path');
const morgan = require('morgan');
const { connectDB } = require('./conexion/conexion');  // Asegúrate de que la ruta y la exportación sean correctas

const app = express();

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));

const customerRoutes = require('./routers/customer');  // Confirma que la ruta sea correcta
app.use('/', customerRoutes);

app.use(express.static(path.join(__dirname, 'public')));

// Conectar a la base de datos antes de iniciar el servidor
connectDB().then(() => {
    app.listen(app.get('port'), () => {
        console.log(`Server on port ${app.get('port')}`);
    });
}).catch(err => {
    console.error("No se pudo conectar a la base de datos:", err);
    process.exit(1);
});
