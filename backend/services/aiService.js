const db = require('../models');

class AIService {
  constructor() {
    // In a real implementation, you would integrate with an AI service like:
    // - OpenAI GPT
    // - Google Cloud AI
    // - AWS SageMaker
    // For now, we'll use rule-based recommendations
  }

  // Generate sleep analysis based on sleep logs
  async analyzeSleep(userId) {
    try {
      // Get recent sleep logs (last 7 days)
      const sleepLogs = await db.SleepLog.findAll({
        where: { user_id: userId },
        order: [['log_date', 'DESC']],
        limit: 7
      });

      if (sleepLogs.length === 0) {
        return {
          analysis: "No sleep data available. Start logging your sleep to get personalized recommendations.",
          recommendation: "Aim for 7-9 hours of sleep per night for optimal health and recovery."
        };
      }

      const avgSleep = sleepLogs.reduce((sum, log) => sum + parseFloat(log.hours_slept), 0) / sleepLogs.length;
      
      let analysis = "";
      let recommendation = "";

      if (avgSleep < 6) {
        analysis = `Your average sleep duration is ${avgSleep.toFixed(1)} hours, which is below the recommended 7-9 hours.`;
        recommendation = "Consider establishing a consistent bedtime routine, avoiding screens before bed, and creating a comfortable sleep environment.";
      } else if (avgSleep <= 8) {
        analysis = `Your average sleep duration is ${avgSleep.toFixed(1)} hours, which is within the healthy range.`;
        recommendation = "Maintain your good sleep habits. Consider tracking sleep quality in addition to duration.";
      } else {
        analysis = `Your average sleep duration is ${avgSleep.toFixed(1)} hours.`;
        recommendation = "While you're getting adequate sleep, ensure you're maintaining good sleep quality and not oversleeping consistently.";
      }

      // Check for consistency
      const variances = sleepLogs.map(log => Math.abs(parseFloat(log.hours_slept) - avgSleep));
      const avgVariance = variances.reduce((sum, v) => sum + v, 0) / variances.length;

      if (avgVariance > 1.5) {
        analysis += " Your sleep schedule appears inconsistent.";
        recommendation += " Try to maintain consistent sleep and wake times, even on weekends.";
      }

      return {
        analysis,
        recommendation,
        metrics: {
          averageSleep: avgSleep.toFixed(1),
          consistency: avgVariance < 1 ? 'Good' : 'Needs Improvement',
          daysAnalyzed: sleepLogs.length
        }
      };
    } catch (error) {
      console.error('Sleep analysis error:', error);
      throw new Error('Failed to analyze sleep data');
    }
  }

  // Generate diet suggestions based on diet logs
  async analyzeDiet(userId) {
    try {
      // Get recent diet logs (last 3 days)
      const dietLogs = await db.DietChart.findAll({
        where: { user_id: userId },
        order: [['log_date', 'DESC']],
        limit: 21 // 3 days * 7 meals max
      });

      if (dietLogs.length === 0) {
        return {
          analysis: "No diet data available. Start logging your meals to get personalized nutrition recommendations.",
          recommendation: "Aim for a balanced diet with plenty of fruits, vegetables, lean proteins, and whole grains."
        };
      }

      const mealsByType = {
        Breakfast: [],
        Lunch: [],
        Dinner: [],
        Snack: []
      };

      dietLogs.forEach(log => {
        if (mealsByType[log.meal_type]) {
          mealsByType[log.meal_type].push(log.food_item);
        }
      });

      let analysis = "Based on your recent food logs: ";
      let recommendation = "";

      // Simple analysis based on common healthy food patterns
      const allFoods = dietLogs.map(log => log.food_item.toLowerCase());
      
      const hasVegetables = allFoods.some(food => 
        ['vegetable', 'salad', 'broccoli', 'spinach', 'carrot', 'kale'].some(veg => food.includes(veg))
      );
      
      const hasFruits = allFoods.some(food => 
        ['fruit', 'apple', 'banana', 'orange', 'berry'].some(fruit => food.includes(fruit))
      );
      
      const hasProtein = allFoods.some(food => 
        ['chicken', 'fish', 'meat', 'egg', 'tofu', 'bean', 'lentil'].some(protein => food.includes(protein))
      );

      if (!hasVegetables) {
        analysis += "Your diet appears low in vegetables. ";
        recommendation += "Try to include more colorful vegetables in your meals. ";
      }

      if (!hasFruits) {
        analysis += "Fruit consumption seems limited. ";
        recommendation += "Consider adding fruits as snacks or with meals. ";
      }

      if (!hasProtein) {
        analysis += "Protein intake may be insufficient. ";
        recommendation += "Include protein sources like lean meat, fish, eggs, or plant-based alternatives. ";
      }

      if (analysis === "Based on your recent food logs: ") {
        analysis += "Your diet shows good variety with fruits, vegetables, and protein sources.";
        recommendation = "Continue maintaining this balanced approach to nutrition.";
      }

      return {
        analysis,
        recommendation,
        metrics: {
          totalMeals: dietLogs.length,
          hasVegetables,
          hasFruits,
          hasProtein
        }
      };
    } catch (error) {
      console.error('Diet analysis error:', error);
      throw new Error('Failed to analyze diet data');
    }
  }

  // Generate exercise suggestions based on workout logs and BMI
  async analyzeExercise(userId) {
    try {
      // Get user data
      const user = await db.User.findByPk(userId);
      const bmiRecords = await db.BmiRecord.findAll({
        where: { user_id: userId },
        order: [['created_at', 'DESC']],
        limit: 1
      });
      const workouts = await db.WorkoutLog.findAll({
        where: { user_id: userId },
        order: [['log_date', 'DESC']],
        limit: 7
      });

      const currentBMI = bmiRecords.length > 0 ? bmiRecords[0] : null;
      
      let analysis = "";
      let recommendation = "";

      if (!currentBMI) {
        analysis = "No BMI data available. Calculate your BMI to get personalized exercise recommendations.";
        recommendation = "A combination of cardio and strength training is generally recommended for overall fitness.";
      } else {
        const bmiCategory = currentBMI.bmi_category;
        const bmiValue = currentBMI.bmi_value;

        analysis = `Based on your BMI of ${bmiValue} (${bmiCategory}): `;

        switch (bmiCategory) {
          case 'Underweight':
            recommendation = "Focus on strength training to build muscle mass, combined with adequate nutrition.";
            break;
          case 'Normal':
            recommendation = "Maintain your fitness with a balanced routine of cardio and strength training.";
            break;
          case 'Overweight':
          case 'Obese':
            recommendation = "Prioritize cardio exercises for weight loss, complemented by strength training to maintain muscle.";
            break;
          default:
            recommendation = "A balanced exercise routine with both cardio and strength training is recommended.";
        }
      }

      // Analyze workout frequency
      if (workouts.length > 0) {
        const workoutDays = new Set(workouts.map(w => w.log_date)).size;
        
        if (workoutDays >= 5) {
          analysis += "You're maintaining an excellent workout frequency. ";
        } else if (workoutDays >= 3) {
          analysis += "You have a good workout routine. ";
          recommendation += "Consider adding 1-2 more workout days per week for optimal results.";
        } else {
          analysis += "Your workout frequency could be improved. ";
          recommendation += "Aim for at least 3-4 workout sessions per week for better fitness outcomes.";
        }

        // Check workout variety
        const exerciseTypes = new Set(workouts.map(w => w.exercise_name.toLowerCase()));
        if (exerciseTypes.size < 3) {
          analysis += "Your exercise variety is limited. ";
          recommendation += "Try incorporating different types of exercises to work various muscle groups.";
        }
      } else {
        analysis += "No recent workout data available. ";
        recommendation += "Start with 2-3 workouts per week and gradually increase frequency and intensity.";
      }

      return {
        analysis,
        recommendation,
        metrics: {
          currentBMI: currentBMI ? currentBMI.bmi_value : null,
          bmiCategory: currentBMI ? currentBMI.bmi_category : null,
          recentWorkouts: workouts.length,
          workoutDays: workouts.length > 0 ? new Set(workouts.map(w => w.log_date)).size : 0
        }
      };
    } catch (error) {
      console.error('Exercise analysis error:', error);
      throw new Error('Failed to analyze exercise data');
    }
  }

  // Generate comprehensive wellness report
  async generateWellnessReport(userId) {
    try {
      const [sleepAnalysis, dietAnalysis, exerciseAnalysis] = await Promise.all([
        this.analyzeSleep(userId),
        this.analyzeDiet(userId),
        this.analyzeExercise(userId)
      ]);

      // Save recommendations to database
      const recommendations = [];
      
      for (const [type, analysis] of [
        ['sleep_analysis', sleepAnalysis],
        ['diet_suggestion', dietAnalysis],
        ['exercise_suggestion', exerciseAnalysis]
      ]) {
        const rec = await db.AiRecommendation.create({
          user_id: userId,
          recommendation_type: type,
          input_data: analysis.metrics || {},
          recommendation_text: `${analysis.analysis} ${analysis.recommendation}`
        });
        recommendations.push(rec);
      }

      return {
        sleep: sleepAnalysis,
        diet: dietAnalysis,
        exercise: exerciseAnalysis,
        recommendations
      };
    } catch (error) {
      console.error('Wellness report generation error:', error);
      throw new Error('Failed to generate wellness report');
    }
  }
}

module.exports = new AIService();