const User = require("../models/User");
const bcrypt = require('bcrypt');

module.exports = {
    async index(req, res){
        const users = await User.findAll();

        return res.json(users);
    },

    async create(req, res) {
        const { name, last_name, email, cpf } = req.body;
        const hash = bcrypt.hashSync(cpf, 10);

        try {

            const count = await User.count({
                where: {
                    email: email
                }
            }); 

            if(count <= 0){
                const user = await User.create({
                    access_level: 2,
                    name,
                    last_name,
                    email,
                    password: hash,
                    cpf
                });
    
                return res.status(200).json({
                    success: true,
                    message: "Cadastrado com Sucesso!",
                    data: user
                });
            } else {
                console.log("Erro: Usuário já cadastrado.");
                return res.status(400).json({
                    success: false,
                    message: "Falha no Cadastro! Usuário já cadastrado."
                });
            }
            
        } catch (error){
            console.log("Erro: " + error);
            return res.status(400).json({
                success: false,
                message: "Falha no Cadastro!"
            });
        }
    },

    async auth(req, res){
        const {email, password} = req.body;

        try {
            const count = await User.count({
                where: {
                    email: email
                }
            });

            if(count <= 0){
                return res.json({
                    success: false,
                    message: "E-mail não encontrado! Cadastre-se ou cheque as credenciais de login e tente novamente."
                });
            } else {
                var user = await User.findOne({
                    attributes: ['password', 'id', 'access_level'],
                    where: {
                        email: email
                    }
                });

                const passbd = user.getDataValue("password");
                const match = await bcrypt.compare(password, passbd);

                if (match){
                    return res.status(200).json({
                        success: true,
                        message: "Login realizado com Sucesso!",
                        data: user,
                        id: user.getDataValue('id')
                    });
                } else {
                    return res.json({
                        success: false,
                        message: "Senha incorreta!"
                    });
                }
            }
        } catch (error) {
            console.log("Erro: " + error);

            return res.status(400).json({
                success: false,
                message: "Credenciais inválidas!"
            });
        }
    },

    async redefinePassword(req, res){
        const {access_level, name, last_name, email, cpf, password} = req.body;

        try {
            if(access_level == 1){
                const hash = bcrypt.hashSync(password, 10);

                const user = await User.findOne({
                    attributes: ['id', 'name', 'last_name', 'email', 'cpf', 'password'],
                    where: {
                        email: email,
                        cpf: cpf
                    }
                });

                if(hash !== ""){
                    user.password = hash;
                }

                await user.save();
                return res.status(200).json({
                    success: true
                });

            } else {
                const hash = bcrypt.hashSync(cpf, 10);

                const user = await User.findOne({
                    attributes: ['id', 'name', 'last_name', 'email', 'cpf', 'password'],
                    where: {
                        name, 
                        last_name,
                        email,
                        cpf
                    }
                });

                if(hash !== ""){
                    user.password = hash;
                }

                await user.save();
                return res.status(200).json({
                    success: true,
                    data: user
                });
            }

            
        } catch (error) {
            console.log("Erro: " + error);
            return res.status(400).json({
                success: false,
                message: "Falha ao redefinir senha!"
            });
        }
    }
}