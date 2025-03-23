const port = 8080;

// Inicializo express
const express = require("express");
const app = express();

const cors = require('cors');
app.use(cors());

// Mongo
require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Conectado a MongoDB Atlas"))
    .catch((err) => console.error("Error al conectar con MongoDB:", err));

// Middleware para recibir JSON
app.use(express.json());

const viewRouter = require("./routes/viewRouter");
app.use("/", viewRouter);

// Rutas
const router = express.Router();
app.use("/api", router);

// Configuración handlebars
const exphbs = require("express-handlebars");
const path = require("path");

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));
app.engine("handlebars", exphbs.engine({
    helpers: {
        multiply: (a, b) => a * b
    }
}));

const products = require("./routes/products");
const carts = require("./routes/carts");

router.use("/products", products);
router.use("/carts", carts);

// Levanto servidor en puerto 8080
app.listen(port, () => {
    console.log("Servidor escuchando en puerto " + port);
})