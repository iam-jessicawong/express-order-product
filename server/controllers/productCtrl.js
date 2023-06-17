const findAll = async (req, res) => {
  try {
    const products = await req.context.models.products.findAll({
      include: {
        model: req.context.models.product_category,
        as: "category",
      },
    });
    return res.send(products);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const findOne = async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).send("id must be a number starting from 1");
  }

  try {
    const product = await req.context.models.products.findOne({
      where: { id: id },
      include: {
        model: req.context.models.product_category,
        as: "category",
      },
    });

    if (!product) {
      return res.status(404).send(`product with id ${id} not found`);
    }

    return res.send(product);
  } catch (error) {
    return res.send(error);
  }
};

const create = async (req, res) => {
  const { name, description, category_id, price, qty } = req.body;

  if (!name || !price || !qty) return res.status(400).send("name, price and qty is required");

  try {
    const product = await req.context.models.products.create({
      name,
      description,
      category_id,
      price,
      qty,
      image: req.file.filename,
    });

    res.status(201).send({
      message: "product created successfully",
      product
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const { qty } = req.body;

  if ( !qty || isNaN(qty) ) return res.status(400).send("quantity must be a number");

  try {
    const product = await req.context.models.products.update(
      {
        qty: parseInt(qty),
      },
      { where: { id: id } }
    );

    if (product[0] < 1) return res.status(404).send(`product id ${id} is not exist`);

    return res.send(`product quantity updated`);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

export default {
  findAll,
  findOne,
  create,
  update
};
