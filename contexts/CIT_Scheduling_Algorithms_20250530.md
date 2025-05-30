# CIT_Scheduling_Algorithms_20250530.md

## ⏰ GARDEN Scheduling Algorithm Library

```
Project: Reusable Scheduling Patterns and Algorithms
Current Version: v1.0 (Extracted from medication scheduling patterns)
Date: 20250530
Status: Core algorithms for time-based scheduling
Purpose: Prevent timing conflicts and manual recalculation cycles
```

## 🔢 **CORE SCHEDULING ALGORITHMS**

### **Every-X-Hours Calculator**
```javascript
// Calculate next valid dose times for "every X hours" medications
function calculateDoseTimes(startTime, intervalHours, maxDoses = 3) {
    const times = [startTime];
    let currentTime = startTime;
    
    for (let i = 1; i < maxDoses; i++) {
        currentTime = addHours(currentTime, intervalHours);
        // Handle day boundary
        if (currentTime >= 24) {
            currentTime = currentTime - 24;
        }
        times.push(currentTime);
    }
    
    return times;
}

// Helper: Add hours to time (24-hour format)
function addHours(time, hours) {
    return time + hours;
}
```

### **Conflict Detection**
```javascript
// Detect scheduling conflicts between medications
function detectConflicts(schedule, minSpacing = 0.5) {
    const conflicts = [];
    
    for (let i = 0; i < schedule.length; i++) {
        for (let j = i + 1; j < schedule.length; j++) {
            const timeDiff = Math.abs(schedule[i].time - schedule[j].time);
            
            if (timeDiff < minSpacing) {
                conflicts.push({
                    items: [schedule[i], schedule[j]],
                    overlap: minSpacing - timeDiff
                });
            }
        }
    }
    
    return conflicts;
}
```

## 📊 **CONSTRAINT SATISFACTION**

### **Multi-Medication Scheduler**
```javascript
// Solve for optimal schedule given multiple constraints
function optimizeSchedule(medications) {
    const schedule = [];
    
    // Sort by strictness (most constrained first)
    medications.sort((a, b) => b.priority - a.priority);
    
    medications.forEach(med => {
        const validSlots = findValidTimeSlots(
            schedule, 
            med.intervalHours,
            med.minSpacing
        );
        
        // Place in first valid slot
        if (validSlots.length > 0) {
            schedule.push({
                name: med.name,
                times: validSlots[0],
                priority: med.priority
            });
        }
    });
    
    return schedule;
}
```

## 🌙 **SLEEP-AWARE SCHEDULING**

### **Night Dose Optimization**
```javascript
// Adjust schedule to respect sleep patterns
function adjustForSleep(schedule, bedtime = 22, wakeTime = 7) {
    const sleepHours = bedtime > wakeTime 
        ? (24 - bedtime) + wakeTime 
        : wakeTime - bedtime;
    
    return schedule.map(dose => {
        // If dose falls during sleep, adjust
        if (isDuringSleep(dose.time, bedtime, wakeTime)) {
            return {
                ...dose,
                adjusted: true,
                originalTime: dose.time,
                time: dose.critical 
                    ? dose.time  // Keep critical doses
                    : wakeTime   // Move to wake time
            };
        }
        return dose;
    });
}
```

## 🔄 **TRANSITION HANDLING**

### **Medication Change Algorithm**
```javascript
// Handle transition between medication regimens
function createTransitionSchedule(oldMeds, newMeds, transitionDate) {
    return {
        today: {
            morning: oldMeds.filter(m => m.endDate === transitionDate),
            afternoon: mixedSchedule(oldMeds, newMeds),
            evening: newMeds.filter(m => m.startDate === transitionDate)
        },
        tomorrow: {
            all: newMeds
        }
    };
}
```

## 📐 **SPACING PATTERNS**

### **Common Medical Spacing Requirements**
```javascript
const MEDICAL_SPACING = {
    // Minimum hours between doses
    antibiotics: 6,
    painRelief: 4,
    sedatives: 6,
    
    // Interaction spacing
    withFood: 0,
    emptyStomach: -1, // 1 hour before food
    afterFood: 0.5,   // 30 min after food
    
    // Safety margins
    similar_drugs: 2,  // Same class medications
    interactions: 4    // Known interactions
};
```

## 🎯 **PATTERN RECOGNITION**

### **Identify Schedule Type**
```javascript
function identifySchedulePattern(times) {
    const intervals = [];
    
    for (let i = 1; i < times.length; i++) {
        intervals.push(times[i] - times[i-1]);
    }
    
    // Check for regular intervals
    const isRegular = intervals.every(i => 
        Math.abs(i - intervals[0]) < 0.5
    );
    
    if (isRegular) {
        return {
            type: 'regular',
            interval: intervals[0],
            baseTime: times[0]
        };
    }
    
    // Check for bid/tid patterns
    if (times.length === 2 && 
        Math.abs(intervals[0] - 12) < 1) {
        return { type: 'BID', times: ['morning', 'evening'] };
    }
    
    if (times.length === 3 && 
        intervals.every(i => Math.abs(i - 8) < 1)) {
        return { type: 'TID', times: ['morning', 'afternoon', 'evening'] };
    }
    
    return { type: 'custom', intervals };
}
```

## 🚨 **SAFETY VALIDATIONS**

### **Overdose Prevention**
```javascript
function validateDosing(medication, proposedSchedule) {
    const errors = [];
    const warnings = [];
    
    // Check maximum daily doses
    const dailyDoses = proposedSchedule.length;
    if (dailyDoses > medication.maxDailyDoses) {
        errors.push(`Exceeds maximum ${medication.maxDailyDoses} doses/day`);
    }
    
    // Check minimum spacing
    const intervals = calculateIntervals(proposedSchedule);
    const minInterval = Math.min(...intervals);
    
    if (minInterval < medication.minHoursBetween) {
        errors.push(`Spacing ${minInterval}h < minimum ${medication.minHoursBetween}h`);
    }
    
    // Warning for edge cases
    if (minInterval < medication.minHoursBetween * 1.1) {
        warnings.push('Close to minimum spacing limit');
    }
    
    return { valid: errors.length === 0, errors, warnings };
}
```

## 📋 **READY-TO-USE TEMPLATES**

### **Standard Medical Schedules**
```javascript
const SCHEDULE_TEMPLATES = {
    // Every 8 hours (TID)
    threeDaily: {
        standard: [7, 15, 23],    // 7am, 3pm, 11pm
        meals: [8, 13, 18],       // With meals
        shifted: [9, 17, 1]       // Late riser
    },
    
    // Every 12 hours (BID)  
    twiceDaily: {
        standard: [8, 20],        // 8am, 8pm
        early: [6, 18],          // 6am, 6pm
        late: [10, 22]           // 10am, 10pm
    },
    
    // Every 6 hours (QID)
    fourDaily: {
        standard: [6, 12, 18, 24],
        awake: [8, 14, 20, 26]    // +2h at bedtime
    }
};
```

## 🔧 **IMPLEMENTATION HELPERS**

### **Time Format Converters**
```javascript
// Convert various time formats
function normalizeTime(input) {
    // "3:30 PM" → 15.5
    if (typeof input === 'string') {
        const [time, period] = input.split(' ');
        const [hours, minutes] = time.split(':').map(Number);
        let h = hours;
        
        if (period === 'PM' && hours !== 12) h += 12;
        if (period === 'AM' && hours === 12) h = 0;
        
        return h + (minutes / 60);
    }
    
    return input; // Already numeric
}

// 15.5 → "3:30 PM"
function formatTime(decimal) {
    const hours = Math.floor(decimal);
    const minutes = Math.round((decimal - hours) * 60);
    
    const h12 = hours > 12 ? hours - 12 : (hours || 12);
    const period = hours >= 12 ? 'PM' : 'AM';
    
    return `${h12}:${minutes.toString().padStart(2, '0')} ${period}`;
}
```

## 📝 **Version History**

```
20250530: v1.0 - Core algorithms extracted from medication scheduling success
```

## 🤖 **Note for Claude**

When handling scheduling requests:
1. **Identify the pattern type** first (regular intervals, with meals, etc.)
2. **Check for conflicts** between multiple scheduled items
3. **Respect human constraints** (sleep, meals, work)
4. **Validate safety** for medical schedules
5. **Provide clear times** in user's preferred format

These algorithms prevent the 4-6 revision cycles typically spent on timing conflicts!