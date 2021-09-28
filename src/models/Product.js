const { Model, DataTypes } = require("sequelize");

class Product extends Model {
    static init(sequelize){
        super.init({
            code: DataTypes.STRING,
            name: DataTypes.STRING,
            current_quantity: DataTypes.INTEGER,
            minimum_quantity: DataTypes.INTEGER,
            status: DataTypes.INTEGER,
        }, {
            sequelize
        })
    }
}

module.exports = Product;