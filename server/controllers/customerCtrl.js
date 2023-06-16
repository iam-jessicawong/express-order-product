const findOne = async (req, res) => {
  try {
    const customer = await req.context.models.customers.findOne({
      where: { user_id: req.user._id },
      include: {
        model: req.context.models.users,
        as: "user"
      },
    });

    return res.send(customer);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

export default {
  findOne,
};
