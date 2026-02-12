const User = require('../models/User');
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');
const { isConnected } = require('../database/db');

// Login por E-mail (Exclusivo para Web/Admin)
exports.loginEmail = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Criar usuário admin padrão se for a primeira vez
        if (email === 'gilberto@gilzapp.com' && isConnected()) {
            let adminUser = await User.findOne({ email });
            if (!adminUser) {
                adminUser = new User({
                    email: 'gilberto@gilzapp.com',
                    password: 'gilzapp_secret',
                    name: 'Gilberto Santos'
                });
                await adminUser.save();
                console.log('Usuário admin criado com sucesso');
            }
        }

        const user = await User.findOne({ email });
        if (!user || !user.password) {
            return res.status(401).json({ message: 'E-mail ou senha inválidos' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'E-mail ou senha inválidos' });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({ token, user });
    } catch (err) {
        console.error('ERRO DETALHADO NO LOGIN:', err);
        res.status(500).json({ message: 'Erro no servidor: houve um problema na autenticação. Tente novamente.' });
    }
};

exports.firebaseLogin = async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken) return res.status(400).json({ message: 'ID Token é obrigatório' });

        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { phone_number: phoneNumber, uid: firebaseUid } = decodedToken;

        if (!phoneNumber) return res.status(400).json({ message: 'Firebase não retornou o número de telefone' });

        let user;
        if (isConnected()) {
            user = await User.findOne({ phoneNumber });
            if (!user) {
                user = new User({ phoneNumber, firebaseUid });
                await user.save();
            } else if (!user.firebaseUid) {
                user.firebaseUid = firebaseUid;
                await user.save();
            }
        } else {
            return res.status(500).json({ message: 'Banco de dados não conectado' });
        }

        const token = jwt.sign(
            { id: user._id, phoneNumber: user.phoneNumber },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({ token, user, firebaseUid });
    } catch (err) {
        console.error('Erro no Firebase Login:', err);
        res.status(401).json({ message: 'Token do Firebase inválido ou expirado' });
    }
};

exports.requestOtp = async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        if (!phoneNumber) return res.status(400).json({ message: 'Número de telefone é obrigatório' });
        console.log(`[GilZapp OTP] Enviado para ${phoneNumber}: 123456`);
        res.json({ message: 'OTP enviado com sucesso (Mock: 123456)' });
    } catch (err) {
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { phoneNumber, otp } = req.body;
        if (otp === '123456') {
            let user = await User.findOne({ phoneNumber });
            if (!user) {
                user = new User({ phoneNumber });
                await user.save();
            }
            const token = jwt.sign({ id: user._id, phoneNumber: user.phoneNumber }, process.env.JWT_SECRET, { expiresIn: '30d' });
            res.json({ token, user });
        } else {
            res.status(400).json({ message: 'Código OTP inválido' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Erro ao verificar OTP' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar perfil' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, bio, photo } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, bio, photo },
            { new: true }
        );
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao atualizar perfil' });
    }
};
