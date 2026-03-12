class ProductModel {
  constructor({
    model,
    position = { x: 0, y: 0 },
    color,
    texture,
    angle,
    isPlaced,
    designId = "",
  }) {
    this.model = model;
    this.position = position;
    this.color = color;
    this.texture = texture;
    this.angle = angle;
    this.isPlaced = isPlaced;
    this.designId = designId;
  }
}

module.exports = ProductModel;
