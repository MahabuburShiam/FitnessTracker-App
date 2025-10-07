const {DataTypes} = require('sequelize');
const sequelize = require('../config/database.js');
const WorkoutGoal = sequelize.define('WorkoutGoal', {
    id : {
        type : DataTypes.UUID,defaultValue: DataTypes.UUIDV4,primaryKey : true
    },
    userId : {type : DataTypes.UUID, allowNull : false, references : {model : 'Users', key : 'id'}},
    goalType : {
        type : DataTypes.ENUM('weight_loss', 'muscle_gain', 'maintenance', 'endurance'), allowNull : false
    },
    targetData : {
        type : DataTypes.DATE, allowNull : true
    },
    weeklyWorkoutDays : {
        type : DataTypes.INTEGER, defaultValue : 4, VALIDATE : {min : 1, max : 7}
    },
    notes : {type : DataTypes.TEXT, allowNull : true
    }
})

module.exports = WorkoutGoal;