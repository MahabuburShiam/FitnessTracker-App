const {DataTypes} = require('sequelize');
const sequelize = require('../config/database.js');

const Sleeping = sequelize.define('sleeplog',{
    id : {

        type : DataTypes.UUID,defaultValue : DataTypes.UUIDV4,primaryKey : 
           true},
    userId : {


        type :  DataTypes.UUID, allowNull : false,references : {model : 'Users', key : 'id'},
        bedtime : {type: DataTypes.TIME, allowNull : false},
        waketime : {type : DataTypes.TIME, allowNull : false},
        duration :{type : DataTypes.FLOAT, allowNull : false, comment : 'Duration in hours'},
        quality :{type : DataTypes.ENUM('poor', 'fair', 'good', 'excellent'), allowNull : false},},
        notes : {type : DataTypes.TEXT, allowNull : true},



        sleepAnalysis :{
            type : DataTypes.VIRTUAL,
            getterMethods(){
                const duration = this.getDataValue('duration');
                const quality= this.getDataValue ('quality')
                let analysis = {

                    recomendation : '',
                    remarks : []
                };
                if (duration < 6){
                    analysis.recommendation = 'Try to increase your sleep duration to at least 7-8 hours for better health.';
                    analysis.remarks.push('Short sleep duration can lead to various health issues including impaired cognitive function and weakened immune response.');
                }
                else if (duration >= 6 && duration < 7){
                    analysis.recommendation = 'You are close to the recommended sleep duration. Aim for 7-8 hours for optimal health.';
                    analysis.remarks.push('Adequate sleep is essential for overall well-being and daily functioning.');
                }   
                else if (duration >= 7 && duration <= 9){
                    analysis.recommendation = 'Great job! You are meeting the recommended sleep duration.';
                    analysis.remarks.push('Maintaining a regular sleep schedule is beneficial for long-term health.');
                }

                //quality analysis
                if (quality === 'poor' || quality === 'fair'){
                    analysis.recommendation += ' Consider improving your sleep quality by maintaining a consistent sleep schedule, creating a restful environment, and avoiding stimulants before bedtime.';
                    analysis.remarks.push('Poor sleep quality can affect mood, cognitive function, and overall health.');
                }
                else if (quality==='excellent'){
                    analysis.remarks.push('Excellent sleep quality contributes significantly to physical and mental health.');
                }
                return analysis;


            }
        }
    },
              
    {indexes : [{unique : true, fields : ['userId', 'date']}]}

);
module.exports = sleeplog




















    
























