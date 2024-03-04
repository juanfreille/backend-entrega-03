import express from "express";
import ProductManager from "./ProductManager.js";

const app = express();
const port = 8080;

const productManager = new ProductManager();

async function generateProductLinks() {
  let linksHTML = "Busqueda por ID:<br><br>";
  for (let i = 1; i <= 10; i++) {
    linksHTML += `<a href="/products/${i}">Producto con ID: ${i}</a><br>`;
  }
  return linksHTML;
}

// Función para formatear JSON de respuesta para que se vea mejor, tabulado y con estilo
function formatJSONResponse(data) {
  return `<div style="font-family: Tahoma, sans-serif; font-size: 13px; white-space: pre-wrap;">${JSON.stringify(
    data,
    null,
    2
  )}</div>`;
}

// Endpoint principal
app.get("/", async (req, res) => {
  try {
    const productLinks = await generateProductLinks();
    const htmlcode = `<head><title>Gestión de productos</title></head>
  <body><h1>BackEnd: Gestión de productos para Entrega 3</h1></body>`;
    const homePage = `${htmlcode}Ingresar en <a href="/products">/products</a> para ver el listado completo de productos<br><br><br><br>${productLinks}`;
    res.send(
      `<div style="font-family: Tahoma, sans-serif; font-size: 16px;">${homePage}</div>`
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para obtener todos los productos
app.get("/products", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || undefined;
    const products = await productManager.getProducts(limit);
    res.status(200).send(formatJSONResponse(products));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para obtener un producto por su ID
app.get("/products/:pid", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId);
    if (product) {
      res.status(200).send(formatJSONResponse(product));
    } else {
      res.status(404).json({ error: "No se encontró el producto" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
