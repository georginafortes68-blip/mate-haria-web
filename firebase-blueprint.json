{
  "entities": {
    "Product": {
      "title": "Product",
      "description": "Un producto de la tienda (desayuno o yerba)",
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "description": { "type": "string" },
        "price": { "type": "number" },
        "category": { "type": "string", "enum": ["breakfast", "yerba"] },
        "imageUrl": { "type": "string" },
        "active": { "type": "boolean" }
      },
      "required": ["name", "price", "category", "imageUrl"]
    },
    "Order": {
      "title": "Order",
      "description": "Un pedido realizado por un cliente",
      "type": "object",
      "properties": {
        "customerName": { "type": "string" },
        "customerPhone": { "type": "string" },
        "items": { "type": "array" },
        "total": { "type": "number" },
        "status": { "type": "string", "enum": ["pending", "processing", "shipped", "delivered"] },
        "cardMessage": { "type": "string" },
        "createdAt": { "type": "string", "format": "date-time" }
      },
      "required": ["customerName", "items", "total", "status", "createdAt"]
    },
    "GalleryItem": {
      "title": "GalleryItem",
      "description": "Imagen de un pedido ya realizado para la galería",
      "type": "object",
      "properties": {
        "title": { "type": "string" },
        "imageUrl": { "type": "string" },
        "createdAt": { "type": "string", "format": "date-time" }
      },
      "required": ["imageUrl"]
    }
  },
  "firestore": {
    "products": {
      "schema": "Product",
      "description": "Colección de productos disponibles"
    },
    "orders": {
      "schema": "Order",
      "description": "Pedidos de los clientes"
    },
    "gallery": {
      "schema": "GalleryItem",
      "description": "Fotos de pedidos anteriores"
    }
  }
}
