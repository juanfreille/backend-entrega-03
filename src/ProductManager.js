import fs from "fs";

export default class ProductManager {
  constructor() {
    this.path = "./src/products.json";
  }

  async addProduct(product) {
    if (!this.isValidProduct(product)) return false;
    const products = await this.getProducts();

    //Se genera un id único basado en el id del utlimo producto de la lista, o 1 si está vacía.
    const newProductId =
      products.length > 0 ? products[products.length - 1].id + 1 : 1;

    // Validación de código único
    const existingProduct = products.find((p) => p.code === product.code);
    if (existingProduct) {
      console.error(`Ya existe un producto con el código "${product.code}".`);
      return false;
    }
    product.id = newProductId;
    products.push(product);
    console.log(`Producto "${product.title}" agregado correctamente.`);
    await this.saveProducts(products);
  }

  isValidProduct(product) {
    const requiredFields = [
      "title",
      "description",
      "price",
      "thumbnail",
      "code",
      "stock",
    ];
    for (const field of requiredFields) {
      if (!product.hasOwnProperty(field)) {
        console.error(
          `El campo "${field}" es obligatorio. "${product.title}" no puede ser agregado`
        );
        return false;
      }
    }
    return true;
  }

  async getProducts() {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error getProducts:", error);
      return [];
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getProducts();
      const product = products.find((product) => product.id === id);
      if (!product) {
        console.log(`No se encontró ningún producto con el ID ${id}.`);
        return;
      }
      return product;
    } catch (error) {
      console.error("Error getProductById:", error);
      return null;
    }
  }

  async updateProduct(id, updatedFields) {
    const products = await this.getProducts();
    const index = products.findIndex((product) => product.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updatedFields };
      await this.saveProducts(products);
    } else {
      console.error("Producto no encontrado.");
    }
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const product = products.filter((product) => product.id !== id);
    await this.saveProducts(product);
  }

  async saveProducts(products) {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    } catch (error) {
      console.error("Error saveProducts:", error);
    }
  }
}
