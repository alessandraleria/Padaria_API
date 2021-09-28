const Product = require("../models/Product");

module.exports = {
    async index(req, res){
        const products = await Product.findAll();
        return res.json(products);
    },

    async create(req, res){
        const {code, name, current_quantity, minimum_quantity} = req.body;

        try {
            const count = await Product.count({
                where: {
                    code: code
                }
            });

            if(count <= 0){
                const product = await Product.create({
                    code,
                    name,
                    current_quantity,
                    minimum_quantity,
                    status: 1
                });

                return res.status(200).json({
                    success: true,
                    message: "Produto cadastrado com sucesso!",
                    data: product
                });
            } else {
                console.log("Erro: Produto já cadastrado.");
                return res.status(400).json({
                    success: false,
                    message: "Falha ao cadastrar produto!"
                });
            }
        } catch (error) {
            console.log("Erro: " + error);
            return res.status(400).json({
                success: false,
                message: "Falha no Cadastro!"
            });
        }
    },

    async edit(req, res){
        const {id, code, name, minimum_quantity, status} = req.body;

        try {
            const product = await Product.findOne({
                attributes: ['id', 'name', 'minimum_quantity', 'status'],
                where: {
                    id: id
                }
            });

            if(name !== "")
                product.name = name;
            
            if(minimum_quantity !== "")
                product.minimum_quantity = minimum_quantity
            
            if(status !== "")
                product.status = status;
            
            await product.save();

            return res.status(200).json({
                success: true,
                name: product.getDataValue('name'),
                minimum_quantity: product.getDataValue('minimum_quantity'),
                status: product.getDataValue('status')
            });
        } catch (error) {
            console.log("Erro: " + error);
            return res.status(400).json({
                success: false,
                message: "Falha ao editar produto!"
            });
        }
    },

    async delete(req, res){
        const { id } = req.body;

        try {
            const product = await Product.findOne({
                where: {
                    id: id,
                }
            });

            await product.destroy();

            return res.status(200).json({
                success: true,
                message: "Produto excluído com sucesso!"
            });
            
        } catch (error) {
            console.log("Erro: " + error);
            return res.status(400).json({
                success: false,
                message: "Falha ao buscar produto!"
            });
        }
    }
    
}