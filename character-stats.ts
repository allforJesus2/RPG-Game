interface Stats {
    strength: number;
    endurance: number;
    recovery: number;
    energy: number;
    health: number;
}

interface Hormones {
    growthHormone: number;
    testosterone: number;
    cortisol: number;
    insulin: number;
    leptin: number;
}

interface Nutrients {
    protein: number;
    carbs: number;
    fats: number;
    vitamins: {
        vitaminD: number;
        vitaminB12: number;
        iron: number;
        magnesium: number;
        calcium: number;
        zinc: number;
        vitaminC: number;
        omega3: number;
    };
}

interface Training {
    lastTrainingTime: Date;
    dailyVolumeByMuscle: Map<string, number>;
    recoveryNeeded: Map<string, number>;
    injuryRisk: number;
}

class Character {
    private name: string;
    private level: number;
    private experience: number;
    private stats: Stats;
    private hormones: Hormones;
    private nutrients: Nutrients;
    private training: Training;
    private sleepQuality: number;
    private hydration: number;

    constructor(name: string) {
        this.name = name;
        this.level = 1;
        this.experience = 0;
        
        // Initialize base stats
        this.stats = {
            strength: 10,
            endurance: 10,
            recovery: 10,
            energy: 100,
            health: 100
        };

        // Initialize hormones (0-100 scale)
        this.hormones = {
            growthHormone: 50,
            testosterone: 50,
            cortisol: 30,
            insulin: 50,
            leptin: 50
        };

        // Initialize nutrients
        this.nutrients = {
            protein: 100,
            carbs: 100,
            fats: 100,
            vitamins: {
                vitaminD: 100,
                vitaminB12: 100,
                iron: 100,
                magnesium: 100,
                calcium: 100,
                zinc: 100,
                vitaminC: 100,
                omega3: 100
            }
        };

        // Initialize training status
        this.training = {
            lastTrainingTime: new Date(),
            dailyVolumeByMuscle: new Map(),
            recoveryNeeded: new Map(),
            injuryRisk: 0
        };

        this.sleepQuality = 100;
        this.hydration = 100;
    }

    // Training Methods
    public train(exerciseType: string, intensity: number, duration: number): void {
        if (!this.canTrain()) {
            throw new Error("Cannot train - recovery needed or energy too low");
        }

        // Calculate energy cost
        const energyCost = this.calculateEnergyCost(intensity, duration);
        if (this.stats.energy < energyCost) {
            throw new Error("Insufficient energy for training");
        }

        // Apply training effects
        this.applyTrainingEffects(exerciseType, intensity, duration);
        
        // Update recovery needs
        this.updateRecoveryNeeds(exerciseType, intensity);
        
        // Update hormone levels
        this.updateHormones(intensity, duration);
        
        // Deplete nutrients
        this.depleteNutrients(intensity, duration);
        
        // Update injury risk
        this.updateInjuryRisk(intensity);
    }

    private canTrain(): boolean {
        return this.stats.energy > 20 && this.training.injuryRisk < 80;
    }

    private calculateEnergyCost(intensity: number, duration: number): number {
        return (intensity * duration * 0.1) + (this.training.injuryRisk * 0.2);
    }

    private applyTrainingEffects(exerciseType: string, intensity: number, duration: number): void {
        const gainMultiplier = this.calculateGainMultiplier();
        
        switch(exerciseType) {
            case 'strength':
                this.stats.strength += (intensity * duration * 0.01) * gainMultiplier;
                break;
            case 'endurance':
                this.stats.endurance += (intensity * duration * 0.01) * gainMultiplier;
                break;
            default:
                throw new Error("Unknown exercise type");
        }

        // Update daily volume
        const currentVolume = this.training.dailyVolumeByMuscle.get(exerciseType) || 0;
        this.training.dailyVolumeByMuscle.set(exerciseType, currentVolume + (intensity * duration));
    }

    private calculateGainMultiplier(): number {
        let multiplier = 1.0;
        
        // Hormone effects
        multiplier *= (this.hormones.growthHormone / 50);
        multiplier *= (this.hormones.testosterone / 50);
        
        // Nutrient effects
        if (this.nutrients.protein < 50) multiplier *= 0.7;
        if (this.hydration < 50) multiplier *= 0.8;
        
        // Recovery effects
        if (this.sleepQuality < 50) multiplier *= 0.9;
        
        return multiplier;
    }

    // Nutrition Methods
    public eat(food: { protein: number, carbs: number, fats: number, vitamins: Partial<typeof this.nutrients.vitamins> }): void {
        // Update nutrients
        this.nutrients.protein = Math.min(100, this.nutrients.protein + food.protein);
        this.nutrients.carbs = Math.min(100, this.nutrients.carbs + food.carbs);
        this.nutrients.fats = Math.min(100, this.nutrients.fats + food.fats);
        
        // Update vitamins
        Object.entries(food.vitamins).forEach(([vitamin, amount]) => {
            this.nutrients.vitamins[vitamin] = Math.min(100, this.nutrients.vitamins[vitamin] + amount);
        });
        
        // Update hormones based on meal
        this.updateHormonesFromMeal(food);
    }

    // Battle Methods
    public battle(opponent: Character, intensity: number, duration: number): void {
        // Treat battle as a training session
        this.train('combat', intensity, duration);
        
        // Calculate battle specific fatigue
        const fatigue = intensity * duration * 0.2;
        this.stats.energy -= fatigue;
        
        // Update cortisol from combat stress
        this.hormones.cortisol += intensity * 0.3;
        
        // Deplete combat-specific nutrients
        this.depleteNutrients(intensity, duration);
    }

    // Recovery Methods
    public rest(hours: number): void {
        // Recover energy
        this.stats.energy = Math.min(100, this.stats.energy + (hours * 5));
        
        // Reduce injury risk
        this.training.injuryRisk = Math.max(0, this.training.injuryRisk - (hours * 2));
        
        // Update hormones during rest
        this.updateHormonesFromRest(hours);
        
        // Heal if needed
        if (this.stats.health < 100) {
            this.stats.health = Math.min(100, this.stats.health + (hours * this.stats.recovery * 0.1));
        }
    }

    public sleep(hours: number, quality: number): void {
        this.sleepQuality = quality;
        
        // Enhanced recovery during sleep
        this.rest(hours * 1.5);
        
        // Growth hormone peaks during sleep
        this.hormones.growthHormone += quality * 0.5;
        
        // Reset cortisol
        this.hormones.cortisol = Math.max(20, this.hormones.cortisol - (quality * 0.3));
    }

    // Getter methods for status checks
    public getStatus(): {
        stats: Stats,
        hormones: Hormones,
        nutrients: Nutrients,
        training: Training
    } {
        return {
            stats: {...this.stats},
            hormones: {...this.hormones},
            nutrients: {...this.nutrients},
            training: {...this.training}
        };
    }
}

export default Character;
