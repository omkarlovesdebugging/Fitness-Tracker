import { addFoodEntry, addExerciseEntry } from '../services/logService.js';

const foodEntries = [
  {
    name: 'Oatmeal with Banana',
    calories: 350,
    protein: 12,
    carbs: 65,
    fat: 6,
    date: '2025-04-14',
    mealType: 'breakfast'
  },
  {
    name: 'Greek Yogurt with Berries',
    calories: 180,
    protein: 15,
    carbs: 20,
    fat: 3,
    date: '2025-04-14',
    mealType: 'breakfast'
  },
  {
    name: 'Grilled Chicken Salad',
    calories: 420,
    protein: 35,
    carbs: 25,
    fat: 22,
    date: '2025-04-14',
    mealType: 'lunch'
  },
  {
    name: 'Quinoa Bowl',
    calories: 380,
    protein: 14,
    carbs: 65,
    fat: 8,
    date: '2025-04-14',
    mealType: 'lunch'
  },
  {
    name: 'Salmon with Sweet Potato',
    calories: 550,
    protein: 42,
    carbs: 45,
    fat: 25,
    date: '2025-04-14',
    mealType: 'dinner'
  }
];

const exerciseEntries = [
  {
    name: 'Morning Jog',
    duration: 30,
    caloriesBurned: 300,
    date: '2025-04-14',
    exerciseType: 'cardio'
  },
  {
    name: 'Weight Training - Upper Body',
    duration: 45,
    caloriesBurned: 250,
    date: '2025-04-14',
    exerciseType: 'strength'
  },
  {
    name: 'Yoga Session',
    duration: 60,
    caloriesBurned: 200,
    date: '2025-04-14',
    exerciseType: 'flexibility'
  },
  {
    name: 'Swimming',
    duration: 40,
    caloriesBurned: 400,
    date: '2025-04-14',
    exerciseType: 'cardio'
  },
  {
    name: 'HIIT Workout',
    duration: 25,
    caloriesBurned: 350,
    date: '2025-04-14',
    exerciseType: 'cardio'
  }
];

export const seedData = async () => {
  try {
    // Add food entries
    console.log('Adding food entries...');
    for (const entry of foodEntries) {
      await addFoodEntry(entry);
      console.log(`Added food entry: ${entry.name}`);
    }

    // Add exercise entries
    console.log('Adding exercise entries...');
    for (const entry of exerciseEntries) {
      await addExerciseEntry(entry);
      console.log(`Added exercise entry: ${entry.name}`);
    }

    console.log('Successfully added all dummy data!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};
