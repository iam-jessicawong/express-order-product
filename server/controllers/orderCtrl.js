const findAll = async (req, res) => {
  try {
    const orders = await req.context.models.orders.findAll({
      where: { user_id: req.user._id },
      include: [
        {
          model: req.context.models.order_detail,
          as: "order_details",
          include: {
            model: req.context.models.products,
            as: "product",
            attributes: ["name", "price"]
          }
        },
        {
          model: req.context.models.users,
          as: "user",
          include: {
            model: req.context.models.customers,
            as: "customers",
            attributes: ["firstname", "lastname"],
          },
          attributes: ["username"],
        }
      ],
    });

    return res.send(orders);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

const create = async (req, res) => {
  let { product_id, qty } = req.body;
  
  product_id = parseInt(product_id);
  qty = parseInt(qty);

  try {
    const product = await req.context.models.products.findOne({ where: { id: product_id } });

    if(!product) return res.status(400).send({ message: "Product you are trying to order is not exist" });
    if(product.qty < qty) return res.status(400).send({ message: `Sorry product available only ${product.qty}`});

    let order = await req.context.models.orders.findOne({ where: { user_id: req.user._id } });
    
    const total_price = qty * parseFloat(product.price);

    if (!order) {
      order = await req.context.models.orders.create({
        user_id: req.user._id,
        total_product: qty,
        total_price: total_price
      });
    } else {
      order.total_product = parseFloat(order.total_product) + qty;
      order.total_price = parseFloat(order.total_price) + total_price;
      await order.save();
    }

    let orderDetail = await req.context.models.order_detail.findOne({ where: {order_id: order.id, product_id: product_id} });
    if(orderDetail) {
      orderDetail.quantity += qty;
      await orderDetail.save({ fields: ["quantity"] });
    } else {
      orderDetail = await req.context.models.order_detail.create({
        order_id: order.id,
        product_id: product_id,
        quantity: qty
      });
    }

    product.qty -= qty;
    await product.save({ fields: ["qty"] });

    return res.status(201).send({
      message: "order created",
      order: {order, orderDetail}
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

export default {
  findAll,
  create,
};
