const findALl = async (req, res) => {
  try {
    const categories = await req.context.models.product_category.findAll({
      include: [{ model: req.context.models.products, as: "products" }]
    }) ;
    return res.send(categories)
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

export default {
  findALl
}