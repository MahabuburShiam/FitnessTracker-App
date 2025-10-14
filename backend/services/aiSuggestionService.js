// aiSuggestionService.js
const { User, WorkoutGoal, SleepLog, DailyLog, WorkoutSuggestion } = require('../models');
const { Op } = require('sequelize');

class AISuggestionService {
  
  async getPersonalizedSuggestions(userId) {
    const user = await User.findByPk(userId);
    const goal = await WorkoutGoal.findOne({
      where: { userId, status: 'active' }
    });
    
    const recentSleep = await SleepLog.findOne({
      where: { userId },
      order: [['date', 'DESC']]
    });

    const recentActivity = await DailyLog.findOne({
      where: { userId },
      order: [['date', 'DESC']]
    });

    return {
      nutrition: await this.generateNutritionPlan(user, goal, recentActivity),
      exercises: await this.generateExerciseSuggestions(user, goal, recentSleep),
      overallRecommendations: this.generateOverallRecommendations(user, goal, recentSleep, recentActivity)
    };
  }

  async generateNutritionPlan(user, goal, recentActivity) {
    const bmi = user.bmi;
    const bmiCategory = user.bmiCategory;
    const age = user.age;
    const gender = user.gender;
    const weight = user.weight;
    const height = user.height;

    // Calculate BMR (Basal Metabolic Rate)
    let bmr;
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    // Calculate TDEE (Total Daily Energy Expenditure) based on activity level
    const activityLevel = recentActivity ? this.calculateActivityLevel(recentActivity.steps) : 'moderate';
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };

    let tdee = bmr * activityMultipliers[activityLevel];

    // Adjust calories based on goal
    let targetCalories;
    let protein, carbs, fat;

    if (goal) {
      switch (goal.goalType) {
        case 'weight_loss':
          targetCalories = tdee * 0.8; // 20% deficit
          protein = Math.round((weight * 2.2) * 1.2); // Higher protein for weight loss
          break;
        case 'muscle_gain':
          targetCalories = tdee * 1.1; // 10% surplus
          protein = Math.round((weight * 2.2) * 1.6); // Higher protein for muscle gain
          break;
        case 'endurance':
          targetCalories = tdee;
          protein = Math.round((weight * 2.2) * 1.4);
          break;
        default: // maintenance
          targetCalories = tdee;
          protein = Math.round((weight * 2.2) * 1.2);
      }
    } else {
      targetCalories = tdee;
      protein = Math.round((weight * 2.2) * 1.2);
    }

    // Calculate carbs and fat based on remaining calories
    const proteinCalories = protein * 4;
    const remainingCalories = targetCalories - proteinCalories;
    
    // 45% carbs, 30% fat distribution
    const carbCalories = remainingCalories * 0.45;
    const fatCalories = remainingCalories * 0.30;
    
    carbs = Math.round(carbCalories / 4);
    fat = Math.round(fatCalories / 9);

    // Generate meal suggestions based on BMI and goals
    const mealPlan = this.generateMealPlan(bmiCategory, goal ? goal.goalType : 'maintenance');

    return {
      dailyCalories: Math.round(targetCalories),
      macronutrients: {
        protein: { grams: protein, percentage: 25 },
        carbohydrates: { grams: carbs, percentage: 45 },
        fat: { grams: fat, percentage: 30 }
      },
      mealPlan,
      hydration: this.generateHydrationPlan(weight, activityLevel),
      supplements: this.recommendSupplements(bmiCategory, goal ? goal.goalType : 'maintenance')
    };
  }

  calculateActivityLevel(steps) {
    if (!steps) return 'moderate';
    
    if (steps < 5000) return 'sedentary';
    if (steps < 7500) return 'light';
    if (steps < 10000) return 'moderate';
    if (steps < 12500) return 'active';
    return 'very_active';
  }

  generateMealPlan(bmiCategory, goalType) {
    const baseMeals = {
      breakfast: {
        underweight: "High-calorie smoothie with oats, peanut butter, banana, and protein powder",
        normal: "Balanced breakfast with eggs, whole grain toast, and avocado",
        overweight: "High-protein breakfast with Greek yogurt, berries, and nuts",
        obesity: "Low-carb breakfast with vegetables and lean protein"
      },
      lunch: {
        underweight: "Calorie-dense meal with rice, chicken, and healthy fats",
        normal: "Balanced meal with lean protein, complex carbs, and vegetables",
        overweight: "High-fiber lunch with salad, grilled chicken, and quinoa",
        obesity: "Portion-controlled meal with emphasis on vegetables and lean protein"
      },
      dinner: {
        underweight: "Nutrient-rich dinner with salmon, sweet potatoes, and vegetables",
        normal: "Light dinner with fish, vegetables, and small portion of carbs",
        overweight: "Low-carb dinner with plenty of vegetables and lean protein",
        obesity: "Early, light dinner focusing on protein and non-starchy vegetables"
      },
      snacks: {
        underweight: "Frequent high-calorie snacks like nuts, dried fruits, and protein bars",
        normal: "Healthy snacks like fruits, yogurt, and nuts between meals",
        overweight: "Low-calorie snacks like vegetables, apple slices, or small portion of nuts",
        obesity: "Very low-calorie snacks like cucumber, celery, or small protein snack"
      }
    };

    // Adjust based on goal type
    const adjustments = {
      weight_loss: {
        general: "Focus on calorie deficit, high protein, and fiber-rich foods",
        tips: ["Increase vegetable intake", "Reduce processed foods", "Control portion sizes"]
      },
      muscle_gain: {
        general: "Calorie surplus with emphasis on protein timing and quality",
        tips: ["Eat every 3-4 hours", "Post-workout protein within 30 minutes", "Stay hydrated"]
      },
      endurance: {
        general: "Carbohydrate-focused diet for sustained energy",
        tips: ["Carbo-load before long sessions", "Electrolyte balance", "Adequate hydration"]
      },
      maintenance: {
        general: "Balanced diet maintaining current weight and performance",
        tips: ["Consistent meal timing", "Varied nutrient intake", "Listen to hunger cues"]
      }
    };

    return {
      meals: {
        breakfast: baseMeals.breakfast[bmiCategory.toLowerCase().replace(' ', '_')] || baseMeals.breakfast.normal,
        lunch: baseMeals.lunch[bmiCategory.toLowerCase().replace(' ', '_')] || baseMeals.lunch.normal,
        dinner: baseMeals.dinner[bmiCategory.toLowerCase().replace(' ', '_')] || baseMeals.dinner.normal,
        snacks: baseMeals.snacks[bmiCategory.toLowerCase().replace(' ', '_')] || baseMeals.snacks.normal
      },
      timing: {
        breakfast: "Within 1 hour of waking",
        lunch: "4-5 hours after breakfast",
        dinner: "3-4 hours before bedtime",
        snacks: "Between main meals as needed"
      },
      goalAdjustment: adjustments[goalType] || adjustments.maintenance
    };
  }

  generateHydrationPlan(weight, activityLevel) {
    const baseWater = weight * 0.033; // Base water in liters
    const activityAdjustment = {
      sedentary: 0,
      light: 0.5,
      moderate: 1,
      active: 1.5,
      very_active: 2
    };

    const totalLiters = baseWater + (activityAdjustment[activityLevel] || 0);
    
    return {
      totalLiters: Math.round(totalLiters * 10) / 10,
      schedule: [
        { time: "Upon waking", amount: "0.5L" },
        { time: "Before breakfast", amount: "0.25L" },
        { time: "Mid-morning", amount: "0.5L" },
        { time: "Before lunch", amount: "0.25L" },
        { time: "Afternoon", amount: "0.5L" },
        { time: "Before dinner", amount: "0.25L" },
        { time: "Evening", amount: "0.25L" }
      ],
      tips: [
        "Drink consistently throughout the day",
        "Increase intake during workouts",
        "Monitor urine color - aim for pale yellow"
      ]
    };
  }

  recommendSupplements(bmiCategory, goalType) {
    const baseSupplements = {
      all: [
        { name: "Multivitamin", purpose: "Fill nutritional gaps", dosage: "As directed" },
        { name: "Vitamin D", purpose: "Bone health and immunity", dosage: "1000-2000 IU daily" },
        { name: "Omega-3", purpose: "Anti-inflammatory", dosage: "1000-2000 mg daily" }
      ]
    };

    const goalSpecific = {
      weight_loss: [
        { name: "Green Tea Extract", purpose: "Metabolism support", dosage: "500 mg daily" },
        { name: "Fiber Supplement", purpose: "Appetite control", dosage: "As needed" }
      ],
      muscle_gain: [
        { name: "Whey Protein", purpose: "Muscle recovery", dosage: "20-30g post-workout" },
        { name: "Creatine", purpose: "Strength and power", dosage: "5g daily" },
        { name: "BCAAs", purpose: "Muscle preservation", dosage: "During workouts" }
      ],
      endurance: [
        { name: "Electrolytes", purpose: "Hydration balance", dosage: "During long sessions" },
        { name: "Beta-Alanine", purpose: "Endurance performance", dosage: "3-6g daily" }
      ]
    };

    return [
      ...baseSupplements.all,
      ...(goalSpecific[goalType] || [])
    ];
  }

  async generateExerciseSuggestions(user, goal, recentSleep) {
    const bmiCategory = user.bmiCategory;
    const sleepQuality = recentSleep ? recentSleep.quality : 'good';
    const sleepDuration = recentSleep ? recentSleep.duration : 7;

    // Get workout suggestions from database based on BMI and goal
    let workoutQuery = {
      where: {
        bmiCategory: bmiCategory
      }
    };

    if (goal) {
      workoutQuery.where.goalType = goal.goalType;
    }

    const suggestions = await WorkoutSuggestion.findAll(workoutQuery);

    // Adjust intensity based on sleep quality
    const intensityAdjustment = this.adjustIntensityForSleep(sleepQuality, sleepDuration);

    const adjustedSuggestions = suggestions.map(suggestion => {
      const adjustedSuggestion = suggestion.toJSON();
      
      // Adjust based on sleep
      if (intensityAdjustment.factor < 1) {
        adjustedSuggestion.intensity = this.downgradeIntensity(suggestion.intensity);
        if (adjustedSuggestion.duration) {
          adjustedSuggestion.duration = Math.round(adjustedSuggestion.duration * intensityAdjustment.factor);
        }
      }

      adjustedSuggestion.sleepAdjustment = intensityAdjustment.reason;

      return adjustedSuggestion;
    });

    // Group by category
    const categorized = {
      cardio: adjustedSuggestions.filter(s => s.category === 'cardio'),
      strength: adjustedSuggestions.filter(s => s.category === 'strength'),
      flexibility: adjustedSuggestions.filter(s => s.category === 'flexibility'),
      balance: adjustedSuggestions.filter(s => s.category === 'balance')
    };

    return {
      weeklySchedule: this.generateWeeklySchedule(categorized, goal ? goal.weeklyWorkoutDays : 3),
      suggestions: categorized,
      recoveryTips: this.generateRecoveryTips(sleepQuality, sleepDuration),
      precautions: this.generatePrecautions(bmiCategory, user.age)
    };
  }

  adjustIntensityForSleep(quality, duration) {
    if (duration < 5 || quality === 'poor') {
      return { factor: 0.7, reason: "Reduced intensity due to poor sleep quality/duration" };
    } else if (duration < 6 || quality === 'fair') {
      return { factor: 0.85, reason: "Slightly reduced intensity due to suboptimal sleep" };
    } else if (duration > 9) {
      return { factor: 0.9, reason: "Slightly reduced intensity - monitor for oversleeping" };
    }
    return { factor: 1.0, reason: "Optimal sleep - full intensity recommended" };
  }

  downgradeIntensity(currentIntensity) {
    const intensities = ['low', 'moderate', 'high'];
    const currentIndex = intensities.indexOf(currentIntensity);
    return currentIndex > 0 ? intensities[currentIndex - 1] : currentIntensity;
  }

  generateWeeklySchedule(suggestions, workoutDays) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const schedule = {};
    
    // Simple scheduling logic
    let dayIndex = 0;
    for (let i = 0; i < workoutDays; i++) {
      const day = days[dayIndex];
      
      // Alternate between strength and cardio
      if (i % 2 === 0) {
        schedule[day] = {
          focus: 'Strength Training',
          exercises: suggestions.strength.slice(0, 4),
          duration: '45-60 minutes'
        };
      } else {
        schedule[day] = {
          focus: 'Cardio',
          exercises: suggestions.cardio.slice(0, 3),
          duration: '30-45 minutes'
        };
      }

      // Add flexibility on some days
      if (i % 3 === 0) {
        schedule[day].additional = {
          type: 'Flexibility',
          exercises: suggestions.flexibility.slice(0, 2),
          duration: '15 minutes'
        };
      }

      dayIndex = (dayIndex + 2) % 7; // Skip a day between workouts
    }

    return schedule;
  }

  generateRecoveryTips(sleepQuality, sleepDuration) {
    const tips = [];
    
    if (sleepDuration < 7) {
      tips.push("Prioritize sleep - aim for 7-9 hours nightly");
      tips.push("Consider naps of 20-30 minutes if sleep deprived");
    }
    
    if (sleepQuality === 'poor' || sleepQuality === 'fair') {
      tips.push("Improve sleep environment: dark, cool, quiet room");
      tips.push("Establish consistent sleep and wake times");
      tips.push("Avoid screens 1 hour before bedtime");
    }
    
    tips.push("Stay hydrated throughout the day");
    tips.push("Include active recovery days with light walking or stretching");
    
    return tips;
  }

  generatePrecautions(bmiCategory, age) {
    const precautions = [];
    
    if (bmiCategory === 'Obesity') {
      precautions.push("Start with low-impact exercises to protect joints");
      precautions.push("Monitor for shortness of breath or dizziness");
      precautions.push("Consider consulting with healthcare provider before intense exercise");
    }
    
    if (age > 50) {
      precautions.push("Include proper warm-up and cool-down periods");
      precautions.push("Focus on balance and flexibility exercises");
      precautions.push("Listen to your body and adjust intensity as needed");
    }
    
    if (bmiCategory === 'Underweight') {
      precautions.push("Ensure adequate calorie intake to support exercise");
      precautions.push("Focus on strength training to build healthy muscle mass");
    }
    
    return precautions.length > 0 ? precautions : ["No specific precautions - listen to your body and stay hydrated"];
  }

  generateOverallRecommendations(user, goal, recentSleep, recentActivity) {
    const recommendations = [];
    const bmiCategory = user.bmiCategory;

    // BMI-based recommendations
    if (bmiCategory === 'Underweight') {
      recommendations.push("Focus on calorie surplus with nutrient-dense foods");
      recommendations.push("Incorporate strength training to build muscle mass");
    } else if (bmiCategory === 'Overweight' || bmiCategory === 'Obesity') {
      recommendations.push("Create sustainable calorie deficit through diet and exercise");
      recommendations.push("Start with low-impact cardio to build endurance");
    }

    // Sleep-based recommendations
    if (recentSleep) {
      if (recentSleep.duration < 7) {
        recommendations.push("Prioritize getting 7-9 hours of sleep for optimal recovery");
      }
      if (recentSleep.quality === 'poor' || recentSleep.quality === 'fair') {
        recommendations.push("Improve sleep hygiene for better recovery and performance");
      }
    }

    // Activity-based recommendations
    if (recentActivity) {
      if (recentActivity.steps < 5000) {
        recommendations.push("Increase daily movement - aim for at least 7,500 steps");
      }
      if (recentActivity.waterIntake < 2) {
        recommendations.push("Increase water intake to support metabolism and recovery");
      }
    }

    // Goal-based recommendations
    if (goal) {
      switch (goal.goalType) {
        case 'weight_loss':
          recommendations.push("Combine cardio and strength training for optimal fat loss");
          recommendations.push("Track food intake to maintain consistent calorie deficit");
          break;
        case 'muscle_gain':
          recommendations.push("Focus on progressive overload in strength training");
          recommendations.push("Ensure adequate protein intake throughout the day");
          break;
        case 'endurance':
          recommendations.push("Gradually increase cardio duration and intensity");
          recommendations.push("Focus on carbohydrate timing around workouts");
          break;
      }
    }

    return recommendations;
  }
}

module.exports = new AISuggestionService();