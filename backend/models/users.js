// users.js - Updated
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: { 
        type: DataTypes.UUID, 
        defaultValue: DataTypes.UUIDV4, 
        primaryKey: true 
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false, 
        unique: true,
        validate: { isEmail: true }
    },
    password: {
        type: DataTypes.STRING, 
        allowNull: false
    },
    firstName: {
        type: DataTypes.STRING, 
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    userType: {
        type: DataTypes.ENUM('admin', 'gym_owner', 'trainer', 'user'),
        defaultValue: 'user',
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER, 
        allowNull: false,
        validate: { min: 0, max: 150 }
    },
    weight: {
        type: DataTypes.FLOAT, 
        allowNull: false,
        validate: { min: 1, max: 200 }
    },
    height: {
        type: DataTypes.FLOAT, 
        allowNull: false,
        validate: { min: 1, max: 300 }
    },
    gender: {
        type: DataTypes.ENUM('male', 'female', 'other'), 
        allowNull: false
    },
    location: {
        type: DataTypes.GEOMETRY('POINT'),
        allowNull: true,
        comment: 'Stores coordinates as POINT(lat lng)'
    },
    bmi: {
        type: DataTypes.VIRTUAL,
        get() {
            const weight = this.getDataValue('weight');
            const height = this.getDataValue('height');
            if (weight && height) {
                return (weight / ((height / 100) ** 2)).toFixed(2);
            }
            return null;
        }
    },
    bmiCategory: {
        type: DataTypes.VIRTUAL,
        get() {
            const bmi = this.get('bmi');
            if (!bmi) return null;
            if (bmi < 18.5) return 'Underweight';
            if (bmi >= 18.5 && bmi < 24.9) return 'Normal weight';
            if (bmi >= 25 && bmi < 29.9) return 'Overweight';
            return 'Obesity';
        }
    }
}, {
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

User.prototype.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = User;