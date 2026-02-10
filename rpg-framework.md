# Health & Fitness RPG Framework

## Core Stats

### Primary Attributes
- **Energy** (0-100): Determines available actions per day
- **Health** (0-100): Overall wellbeing
- **Strength** (1-100): Muscle mass and power
- **Endurance** (1-100): Stamina and cardiovascular fitness
- **Recovery** (0-100): How quickly the body heals and adapts

### Hormones (All scale 0-100)
- **Growth Hormone**: Peaks during sleep, aids recovery
- **Testosterone**: Increases with proper exercise/diet, aids muscle growth
- **Cortisol**: Stress hormone, increases with overtraining
- **Insulin**: Responds to carbohydrate intake, aids nutrient absorption
- **Leptin**: Hunger regulation, affected by body fat %

### Resource Management
- **Nutrients**
  - Protein (0-100%): Muscle repair and growth
  - Carbohydrates (0-100%): Primary energy source
  - Fats (0-100%): Hormone production and energy storage
  - Vitamins/Minerals (0-100%): Various health functions
- **Sleep Quality** (0-100%): Affects recovery and hormones
- **Hydration** (0-100%): Affects all systems

## Game Mechanics

### Food System

1. Food Categories and Portions:

A. Proteins
   - Meats:
     * Chicken Breast (100g): 31g protein, 165 kcal
     * Salmon (100g): 22g protein, 208 kcal
     * Lean Beef (100g): 26g protein, 180 kcal
     * Eggs (1 large): 6g protein, 70 kcal
   
   - Plant-Based:
     * Tofu (100g): 8g protein, 70 kcal
     * Lentils (100g cooked): 9g protein, 116 kcal
     * Black Beans (100g cooked): 8.9g protein, 132 kcal

B. Carbohydrates
   - Complex:
     * Brown Rice (100g cooked): 25g carbs, 112 kcal
     * Sweet Potato (100g): 20g carbs, 86 kcal
     * Oatmeal (40g dry): 27g carbs, 150 kcal
   
   - Simple:
     * Banana (118g): 27g carbs, 105 kcal
     * Apple (182g): 25g carbs, 95 kcal
     * Orange (131g): 15g carbs, 62 kcal

C. Fats
   - Healthy:
     * Avocado (100g): 15g fat, 160 kcal
     * Almonds (28g): 14g fat, 164 kcal
     * Olive Oil (1 tbsp): 14g fat, 120 kcal
   
   - Other:
     * Butter (1 tbsp): 11g fat, 102 kcal
     * Cheese (28g): 9g fat, 110 kcal

2. Meal Timing:
   - Pre-workout: 2-3 hours before (complex carbs + moderate protein)
   - Post-workout: Within 30 mins (simple carbs + high protein)
   - General meals: 3-5 hours apart
   - Night cutoff: 2-3 hours before sleep

3. Portion Effects:
   - Satiety duration based on macronutrient mix
   - Energy spike varies with glycemic index
   - Protein synthesis window after workouts
   - Digestion penalties for oversized meals

### Exercise System

1. Workout Categories:

A. Strength Training
   - Compound Lifts:
     * Squat: 3-5 sets × 3-8 reps
     * Deadlift: 2-4 sets × 3-6 reps
     * Bench Press: 3-5 sets × 4-10 reps
     * Overhead Press: 3-4 sets × 5-10 reps
     * Rows: 3-4 sets × 6-12 reps
   
   - Isolation Exercises:
     * Bicep Curls: 3 sets × 8-12 reps
     * Tricep Extensions: 3 sets × 8-12 reps
     * Leg Extensions: 3 sets × 10-15 reps
     * Lateral Raises: 3 sets × 12-15 reps

B. Cardio Training
   - High Intensity:
     * Sprints: 30s work/30s rest × 10 rounds
     * Jump Rope: 1 min work/30s rest × 8 rounds
     * Burpees: 45s work/15s rest × 6 rounds
   
   - Steady State:
     * Running: 20-60 minutes at 65-75% max heart rate
     * Cycling: 30-90 minutes at 60-70% max heart rate
     * Swimming: 30-45 minutes continuous
   
C. Recovery Activities
   - Stretching: 15-30 minutes
   - Yoga: 30-60 minutes
   - Light Walking: 20-40 minutes
   - Foam Rolling: 10-15 minutes

2. Exercise Parameters:
   - Rest between sets: 1-3 minutes for strength, 30s-1min for hypertrophy
   - Training frequency: 2-3 days rest between same muscle groups
   - Workout duration: 45-75 minutes optimal
   - Progressive overload: 2.5-5% weight increase when hitting rep targets

2. Progressive Overload:
   - Success chance = (Recovery × 0.7 + Energy × 0.3)
   - Each success adds to strength/endurance
   - Failed attempts increase injury risk
   - Auto-deload if cortisol too high

3. Warmup System:
   - Required before intense exercise
   - Reduces injury risk by 50%
   - Takes 10% of daily energy
   - Scales with workout intensity

### Recovery Mechanics

1. Sleep System:
   - Quality affected by:
     - Meal timing (-5 to +5)
     - Exercise timing (-10 to +5)
     - Stress levels (-20 to 0)
   - Growth hormone peaks during deep sleep
   - Recovery rate × sleep quality

2. Injury System:
   - Risk factors:
     - Weight vs. strength ratio
     - Form quality
     - Fatigue level
     - Previous injuries
   - Recovery time based on:
     - Injury severity
     - Recovery stat
     - Sleep quality
     - Nutrition quality

3. Overtraining Prevention:
   - Cortisol increases with:
     - Workout volume
     - Insufficient recovery
     - Poor sleep
     - High stress
   - Auto-debuffs when cortisol too high
   - Forced rest periods if severely overtrained

### Balance Mechanics

1. Nutrient Ratios:
   - Protein:
     - Minimum: 0.8g per lb bodyweight
     - Maximum: 2g per lb bodyweight
     - Excess converts to glucose (expensive energy)
   - Carbs:
     - Primary energy source
     - Cheaper than protein
     - Affects insulin response
   - Fats:
     - Required for hormones
     - Energy dense
     - Moderate cost

2. Exercise Balance:
   - Volume sweet spot:
     - Too low: no adaptation (-0 progress)
     - Optimal: best gains (+3 progress)
     - Too high: breakdown (-1 progress)
   - Rest periods:
     - Required between similar workouts
     - Length based on intensity and recovery stat
     - Can do alternative exercises

3. Progressive Systems:
   - All gains are gradual
   - Faster initial progress
   - Diminishing returns at higher levels
   - Deload weeks prevent plateaus

## Game Loop

1. Daily Cycle:
   - Plan meals (consider budget/nutrients)
   - Choose activities
   - Manage energy
   - Monitor recovery
   - Sleep

2. Weekly Cycle:
   - Plan workout split
   - Track progress
   - Schedule rest days
   - Budget meals
   - Check hormone levels

3. Monthly Cycle:
   - Assess progress
   - Adjust training
   - Plan deload
   - Set new goals

## Success Metrics

1. Physical Development:
   - Strength gains
   - Endurance improvements
   - Body composition
   - Injury prevention

2. Resource Management:
   - Budget efficiency
   - Energy management
   - Time management
   - Recovery optimization

3. Knowledge Building:
   - Understanding nutrition
   - Exercise form mastery
   - Recovery techniques
   - Hormone balance
