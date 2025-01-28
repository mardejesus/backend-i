const port = 8080;

// inicializo express
const express = require("express");
const app = express();

// middleware para recibir JSON
app.use(express.json());

// rutas
const router = express.Router();
app.use("/api", router);

const products = require("./routes/products");
const carts = require("./routes/carts");

router.use("/products", products);
router.use("/carts", carts);

// levanto servidor en puerto 8080
app.listen(port, () => {
    console.log("Servidor escuchando en puerto " + port);
})