import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Activity, Heart, Dumbbell, Cookie } from 'lucide-react';

// Game Engine
class FoodItem {
    constructor(name, nutrients, cost, satiety) {
        this.name = name;
        this.nutrients = nutrients;
        this.cost = cost;
        this.satiety = satiety;
    }
}

const foodDatabase = {
    chicken: new FoodItem(
        "Chicken Breast", 
        {protein: 25, carbs: 0, fats: 3, vitamins: 5}, 
        10, 15
    ),
    rice: new FoodItem(
        "Brown Rice", 
        {protein: 5, carbs: 45, fats: 2, vitamins: 3}, 
        3, 20
    ),
    eggs: new FoodItem(
        "Eggs", 
        {protein: 12, carbs: 1, fats: 10, vitamins: 8}, 
        5, 12
    ),
    banana: new FoodItem(
        "Banana", 
        {protein: 1, carbs: 27, fats: 0, vitamins: 10}, 
        2, 8
    )
};

class Exercise {
    constructor(name, type, intensity) {
        this.name = name;
        this.type = type;
        this.intensity = intensity;
        this.minReps = 1;
        this.maxReps = 20;
        this.currentWeight = 0;
        this.progressionThreshold = 12;
    }
}

class PlayerStats {
    constructor() {
        this.health = 100;
        this.energy = 100;
        this.muscle = 50;
        this.endurance = 50;
        this.recovery = 100;
        this.nutrients = {
            protein: 0,
            carbs: 0,
            fats: 0,
            vitamins: 0
        };
        this.money = 1000;
        this.injuries = [];
        this.lastMealTime = 0;
        this.lastWorkoutTime = 0;
        
        this.hormones = {
            cortisol: 50,
            growthHormone: 50,
            testosterone: 50,
            insulin: 50,
            leptin: 50
        };
        
        this.circadianPhase = 0;
    }
}

class HealthRPG {
    constructor() {
        this.player = new PlayerStats();
        this.currentDay = 1;
        this.currentTime = 8; // Start at 8 AM
        this.exercises = {
            pushups: new Exercise("Push-ups", "strength", 5),
            squats: new Exercise("Squats", "strength", 7),
            jogging: new Exercise("Jogging", "cardio", 4),
            deadlift: new Exercise("Deadlift", "strength", 9)
        };
    }

    eat(foodItem) {
        if (this.player.money < foodItem.cost) {
            return "Not enough money!";
        }

        this.player.lastMealTime = this.currentTime;
        
        for (let nutrient in foodItem.nutrients) {
            this.player.nutrients[nutrient] += foodItem.nutrients[nutrient];
        }

        let totalNutrients = Object.values(this.player.nutrients)
            .reduce((a, b) => a + b, 0);
        if (totalNutrients > 200) {
            this.player.recovery -= 10;
            this.player.energy -= 20;
        }

        this.player.hormones.insulin += (foodItem.nutrients.carbs * 0.5 + 
            foodItem.nutrients.protein * 0.2);
        this.player.hormones.leptin += totalNutrients * 0.1;
        
        if (this.player.hormones.insulin > 70) {
            this.player.hormones.cortisol = Math.max(0, 
                this.player.hormones.cortisol - 10);
        }

        for (let hormone in this.player.hormones) {
            this.player.hormones[hormone] = Math.min(100, 
                this.player.hormones[hormone]);
        }

        this.player.money -= foodItem.cost;
    }

    exercise(exerciseName, reps, weight = 0) {
        const exercise = this.exercises[exerciseName];
        if (!exercise) return "Exercise not found!";

        this.player.lastWorkoutTime = this.currentTime;
        
        let energyLoss = exercise.intensity * (reps / 10);
        let muscleGain = 0;
        let enduranceGain = 0;
        let injuryRisk = 0;

        if (exercise.type === 'strength') {
            if (reps < 5) {
                muscleGain = reps * 0.5;
            } else if (reps >= 8 && reps <= 12) {
                muscleGain = reps * 1.5;
            } else {
                enduranceGain = reps * 1.2;
                muscleGain = reps * 0.3;
            }

            if (weight > exercise.currentWeight) {
                injuryRisk = (weight - exercise.currentWeight) * 0.2;
            }
        } else if (exercise.type === 'cardio') {
            enduranceGain = reps * 0.8;
            muscleGain = reps * 0.1;
        }

        this.player.hormones.cortisol += (exercise.intensity * 0.5 + reps * 0.2);
        this.player.hormones.growthHormone += (exercise.intensity * 0.8);
        this.player.hormones.testosterone += (weight > 0 ? weight * 0.1 : 0) + 
            (reps * 0.3);

        for (let hormone in this.player.hormones) {
            this.player.hormones[hormone] = Math.min(100, 
                this.player.hormones[hormone]);
        }

        this.player.energy -= energyLoss;
        this.player.muscle += muscleGain * (this.player.recovery / 100);
        this.player.endurance += enduranceGain;

        if (Math.random() < injuryRisk) {
            this.player.injuries.push({
                type: "strain",
                severity: injuryRisk * 10,
                duration: Math.ceil(injuryRisk * 3)
            });
        }

        if (reps >= exercise.progressionThreshold && 
            weight >= exercise.currentWeight) {
            exercise.currentWeight += 5;
        }
    }

    sleep(hours) {
        let recoveryGain = hours * 10;
        let sleepQuality = 1.0;
        
        const hoursSinceLastMeal = (this.currentTime - this.player.lastMealTime + 24) % 24;
        if (hoursSinceLastMeal < 2) {
            sleepQuality *= 0.7;
        } else if (hoursSinceLastMeal < 3) {
            sleepQuality *= 0.85;
        }

        const hoursSinceLastWorkout = (this.currentTime - this.player.lastWorkoutTime + 24) % 24;
        if (hoursSinceLastWorkout < 3) {
            sleepQuality *= 0.75;
        } else if (hoursSinceLastWorkout < 4) {
            sleepQuality *= 0.9;
        }

        recoveryGain *= sleepQuality;

        this.player.recovery = Math.min(100, this.player.recovery + recoveryGain);
        this.player.energy = Math.min(100, this.player.energy + recoveryGain);
        
        this.player.nutrients = {protein: 0, carbs: 0, fats: 0, vitamins: 0};
        
        this.currentTime = (this.currentTime + hours) % 24;
        if (this.currentTime < 8) {
            this.currentDay++;
        }

        if (hours >= 7) {
            this.player.hormones.growthHormone += 20;
            this.player.hormones.cortisol -= 15;
        }

        for (let hormone in this.player.hormones) {
            this.player.hormones[hormone] = Math.min(100, 
                Math.max(0, this.player.hormones[hormone]));
        }
    }

    advanceTime(hours) {
        this.currentTime = (this.currentTime + hours) % 24;
        
        for (let hormone in this.player.hormones) {
            this.player.hormones[hormone] = Math.max(0, 
                this.player.hormones[hormone] - (hours * 2));
        }

        if (this.currentTime === 6) {
            this.player.hormones.cortisol += 30;
        } else if (this.currentTime >= 22 || this.currentTime <= 4) {
            this.player.hormones.cortisol -= 10;
        }

        if (this.currentTime >= 22 || this.currentTime <= 2) {
            this.player.hormones.growthHormone += 20;
        } else if (this.currentTime >= 10 && this.currentTime <= 20) {
            this.player.hormones.growthHormone -= 5;
        }

        if (this.currentTime >= 5 && this.currentTime <= 8) {
            this.player.hormones.testosterone += 15;
        }

        for (let hormone in this.player.hormones) {
            this.player.hormones[hormone] = Math.min(100, 
                Math.max(0, this.player.hormones[hormone]));
        }
    }
}

const HealthRPGGame = () => {
    const [gameState, setGameState] = useState(new HealthRPG());
    const [selectedFood, setSelectedFood] = useState("");
    const [selectedExercise, setSelectedExercise] = useState("");
    const [exerciseReps, setExerciseReps] = useState(10);
    const [exerciseWeight, setExerciseWeight] = useState(0);
    const [sleepHours, setSleepHours] = useState(8);
    const [notifications, setNotifications] = useState([]);

    const addNotification = (message, type = 'info') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 5000);
    };

    const updateGame = (newMessage = "") => {
        setGameState({...gameState});
        if (newMessage) {
            addNotification(newMessage);
        }
    };

    const formatTime = (hour) => {
        return `${hour.toString().padStart(2, '0')}:00`;
    };

    return (
        <div className="p-4 max-w-6xl mx-auto relative min-h-screen">
            <div className="fixed bottom-0 left-0 right-0 flex flex-col items-center pb-4 space-y-2 pointer-events-none">
                {notifications.map(({ id, message, type }) => (
                    <div
                        key={id}
                        className={`p-3 rounded-lg shadow-lg text-white 
                            ${type === 'error' ? 'bg-red-500' : 
                              type === 'success' ? 'bg-green-500' : 
                              'bg-blue-500'} 
                            transition-all duration-500 ease-in-out
                            animate-fade-in max-w-md w-full mx-4`}
                    >
                        {message}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="w-6 h-6" />
                            Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-2">
                            <div>Health: {Math.round(gameState.player.health)}</div>
                            <div>Energy: {Math.round(gameState.player.energy)}</div>
                            <div>Muscle: {Math.round(gameState.player.muscle)}</div>
                            <div>Endurance: {Math.round(gameState.player.endurance)}</div>
                            <div>Recovery: {Math.round(gameState.player.recovery)}</div>
                            <div>Money: ${gameState.player.money}</div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="w-6 h-6" />
                            Time
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <div>Day {gameState.currentDay}</div>
                            <div>{formatTime(gameState.currentTime)}</div>
                            <Button 
                                onClick={() => {
                                    gameState.advanceTime(1);
                                    updateGame("1 hour passed");
                                }}
                            >
                                Wait 1 Hour
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Cookie className="w-6 h-6" />
                            Nutrients
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-2">
                            <div>Protein: {Math.round(gameState.player.nutrients.protein)}g</div>
                            <div>Carbs: {Math.round(gameState.player.nutrients.carbs)}g</div>
                            <div>Fats: {Math.round(gameState.player.nutrients.fats)}g</div>
                            <div>Vitamins: {Math.round(gameState.player.nutrients.vitamins)}</div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Heart className="w-6 h-6" />
                            Hormones
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-2">
                            <div>Cortisol: {Math.round(gameState.player.hormones.cortisol)}</div>
                            <div>Growth Hormone: {Math.round(gameState.player.hormones.growthHormone)}</div>
                            <div>Testosterone: {Math.round(gameState.player.hormones.testosterone)}</div>
                            <div>Insulin: {Math.round(gameState.player.hormones.insulin)}</div>
                            <div>Leptin: {Math.round(gameState.player.hormones.leptin)}</div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1 md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Dumbbell className="w-6 h-6" />
                            Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <h3 className="font-semibold">Eat</h3>
                                <select 
                                    className="w-full p-2 border rounded"
                                    onChange={(e) => setSelectedFood(e.target.value)}
                                    value={selectedFood}
                                >
                                    <option value="">Select Food</option>
                                    {Object.entries(foodDatabase).map(([key, food]) => (
                                        <option key={key} value={key}>
                                            {food.name} (${food.cost})
                                        </option>
                                    ))}
                                </select>
                                <Button
                                    className="w-full"
                                    disabled={!selectedFood}
                                    onClick={() => {
                                        const food = foodDatabase[selectedFood];
                                        gameState.eat(food);
                                        updateGame(`Ate ${food.name} (+${food.nutrients.protein}g protein, +${food.nutrients.carbs}g carbs)`);
                                        if (gameState.currentTime >= 22) {
                                            addNotification("Eating late might affect sleep quality", "error");
                                        }
                                        setSelectedFood("");
                                    }}
                                >
                                    Eat
                                </Button>
                            </div>

                            <div className="space-y-2">
                                <h3 className="font-semibold">Exercise</h3>
                                <select 
                                    className="w-full p-2 border rounded"
                                    onChange={(e) => setSelectedExercise(e.target.value)}
                                    value={selectedExercise}
                                >
                                    <option value="">Select Exercise</option>
                                    {Object.entries(gameState.exercises).map(([key, exercise]) => (
                                        <option key={key} value={key}>
                                            {exercise.name} (Intensity: {exercise.intensity})
                                        </option>
                                    ))}
                                </select>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        className="w-1/2 p-2 border rounded"
                                        placeholder="Reps"
                                        value={exerciseReps}
                                        onChange={(e) => setExerciseReps(parseInt(e.target.value) || 0)}
                                        min="1"
                                        max="50"
                                    />
                                    <input
                                        type="number"
                                        className="w-1/2 p-2 border rounded"
                                        placeholder="Weight"
                                        value={exerciseWeight}
                                        onChange={(e) => setExerciseWeight(parseInt(e.target.value) || 0)}
                                        min="0"
                                        max="500"
                                    />
                                </div>
                                <Button
                                    className="w-full"
                                    disabled={!selectedExercise}
                                    onClick={() => {
                                        gameState.exercise(selectedExercise, exerciseReps, exerciseWeight);
                                        updateGame(`Completed ${exerciseReps} reps of ${selectedExercise}`);
                                        
                                        if (gameState.currentTime >= 21) {
                                            addNotification("Working out late might affect sleep quality", "error");
                                        }
                                        
                                        if (exerciseReps < 5) {
                                            addNotification("Low reps: Focus on strength gains", "info");
                                        } else if (exerciseReps >= 8 && exerciseReps <= 12) {
                                            addNotification("Optimal rep range for muscle growth!", "success");
                                        } else if (exerciseReps > 15) {
                                            addNotification("High reps: Focus on endurance", "info");
                                        }
                                        
                                        setSelectedExercise("");
                                    }}
                                >
                                    Exercise
                                </Button>
                            </div>

                            <div className="space-y-2">
                                <h3 className="font-semibold">Sleep</h3>
                                <input
                                    type="number"
                                    className="w-full p-2 border rounded"
                                    placeholder="Hours"
                                    value={sleepHours}
                                    onChange={(e) => setSleepHours(parseInt(e.target.value) || 0)}
                                    min="1"
                                    max="12"
                                />
                                <Button
                                    className="w-full"
                                    onClick={() => {
                                        gameState.sleep(sleepHours);
                                        updateGame(`Slept for ${sleepHours} hours`);
                                        
                                        if (sleepHours < 6) {
                                            addNotification("Not enough sleep for optimal recovery", "error");
                                        } else if (sleepHours >= 7 && sleepHours <= 9) {
                                            addNotification("Optimal sleep duration for recovery!", "success");
                                        }
                                        
                                        const hoursSinceLastMeal = (gameState.currentTime - gameState.player.lastMealTime + 24) % 24;
                                        if (hoursSinceLastMeal < 2) {
                                            addNotification("Recent meal reduced sleep quality", "error");
                                        }
                                        
                                        const hoursSinceLastWorkout = (gameState.currentTime - gameState.player.lastWorkoutTime + 24) % 24;
                                        if (hoursSinceLastWorkout < 3) {
                                            addNotification("Recent workout reduced sleep quality", "error");
                                        }
                                    }}
                                >
                                    Sleep
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default HealthRPGGame;
