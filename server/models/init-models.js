import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _customers from  "./customers.js";
import _order_detail from  "./order_detail.js";
import _orders from  "./orders.js";
import _product_category from  "./product_category.js";
import _products from  "./products.js";
import _users from  "./users.js";
import Sequelize from "sequelize";
import config from "../../config/config.js";

const sequelize = new Sequelize(
  config.db_name,
  config.db_username,
  config.db_password,
  {
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const initModels = (sequelize) => {
  const customers = _customers.init(sequelize, DataTypes);
  const order_detail = _order_detail.init(sequelize, DataTypes);
  const orders = _orders.init(sequelize, DataTypes);
  const product_category = _product_category.init(sequelize, DataTypes);
  const products = _products.init(sequelize, DataTypes);
  const users = _users.init(sequelize, DataTypes);

  order_detail.belongsTo(orders, { as: "order", foreignKey: "order_id"});
  orders.hasMany(order_detail, { as: "order_details", foreignKey: "order_id"});
  products.belongsTo(product_category, { as: "category", foreignKey: "category_id"});
  product_category.hasMany(products, { as: "products", foreignKey: "category_id"});
  order_detail.belongsTo(products, { as: "product", foreignKey: "product_id"});
  products.hasMany(order_detail, { as: "order_details", foreignKey: "product_id"});
  customers.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(customers, { as: "customers", foreignKey: "user_id"});
  orders.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(orders, { as: "orders", foreignKey: "user_id"});

  return {
    customers,
    order_detail,
    orders,
    product_category,
    products,
    users,
  };
};

const models = initModels(sequelize);
export default models;
export { sequelize };
