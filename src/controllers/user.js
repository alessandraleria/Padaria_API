const User = require("../models/User");
const bcrypt = require('bcrypt');

module.exports = {
    async index(req, res){
        const users = await User.findAll({
            attributes: ['cpf', 'name', 'email', 'phone', 'address']
        });

        return res.json(users);
    },

    async profile(req, res){
        const { id } = req.body;

        try {
            const user = await User.findOne({
                where: {
                    id: id,
                }
            });

            return res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            console.log("Erro: " + error);
            return res.status(400).json({
                success: false,
                message: "Falha ao buscar usuário!"
            });
        }
    },

    async create(req, res) {
        const { access_level, name, last_name, email, cpf, phone, address } = req.body;
        const hash = bcrypt.hashSync(cpf, 10);

        try {

            const count = await User.count({
                where: {
                    cpf: cpf
                }
            }); 

            if(count <= 0){
                const user = await User.create({
                    access_level,
                    name,
                    last_name,
                    email,
                    password: hash,
                    cpf,
                    phone,
                    address
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
                    status: 0,
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
                        status: 1,
                        message: "Login realizado com Sucesso!",
                        data: user,
                        id: user.getDataValue('id')
                    });
                } else {
                    return res.json({
                        success: false,
                        status: 2,
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

    async findByCpf(req, res){
        const { cpf } = req.body;
        console.log(req.body);
        const user = await User.findOne({
            where: {
                cpf: cpf
            },
            attributes: ['id', 'name', 'last_name', 'email', 'phone', 'address']
        });
        return res.json(user);
    },

    async edit(req, res){
        const {id, cpf, name, last_name, email, phone, address} = req.body;

        try {
            const user = await User.findOne({
                attributes: ['id', 'cpf', 'name', 'last_name', 'email', 'phone', 'address'],
                where: {
                    cpf: cpf
                }
            });

            if(name !== "")
                user.name = name;
            
            if(last_name !== "")
                user.last_name = last_name
            
            if(email !== "")
                user.email = email;

            if(phone !== "")
                user.phone = phone;
            
            if(address !== "")
                user.address = address;
            
            await user.save();

            return res.status(200).json({
                success: true,
                name: user.getDataValue('name'),
                last_name: user.getDataValue('last_name'),
                email: user.getDataValue('email')
            });
        } catch (error) {
            console.log("Erro: " + error);
            return res.status(400).json({
                success: false,
                message: "Falha ao editar usuário!"
            });
        }
    },

    async delete(req, res){
        const { cpf } = req.body;

        try {
            const user = await User.findOne({
                where: {
                    cpf: cpf,
                }
            });

            await user.destroy();

            return res.status(200).json({
                success: true,
                message: "Usuário excluído com sucesso!"
            });
            
        } catch (error) {
            console.log("Erro: " + error);
            return res.status(400).json({
                success: false,
                message: "Falha ao buscar usuário!"
            });
        }
    },

    async redefinePassword(req, res){
        const {email, cpf} = req.body;

        try {
            const hash = bcrypt.hashSync(cpf, 10);

            const user = await User.findOne({
                attributes: ['id', 'name', 'last_name', 'email', 'cpf', 'password'],
                where: {
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
            
        } catch (error) {
            console.log("Erro: " + error);
            return res.status(400).json({
                success: false,
                message: "Falha ao redefinir senha!"
            });
        }
    }
}