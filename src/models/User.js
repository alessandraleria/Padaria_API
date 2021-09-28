const { Model, DataTypes } = require("sequelize");

class User extends Model {
    static init(sequelize){
        super.init({
            access_level: DataTypes.INTEGER,
            name: DataTypes.STRING,
            last_name: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            cpf: DataTypes.STRING
        }, {
            sequelize
        })
    }
}

module.exports = User;