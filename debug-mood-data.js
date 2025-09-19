// Enhanced Debug utility to check mood data in localStorage
// You can run this in the browser console to see the current mood data

console.log("=== KORU MOOD DATA DEBUG ===");

// Check dashboard data
const dashboardData = localStorage.getItem("koru-dashboard");
if (dashboardData) {
    const data = JSON.parse(dashboardData);
    console.log("📊 Dashboard Data:", data);
    console.log("📈 Mood Trend Array:", data.moodTrend);
    console.log("📈 Mood Trend Length:", data.moodTrend ? data.moodTrend.length : 0);
} else {
    console.log("❌ No dashboard data found");
}

// Check mood assessment data
const moodAssessment = localStorage.getItem("koru-mood-assessment");
if (moodAssessment) {
    const assessment = JSON.parse(moodAssessment);
    console.log("🧠 Last Mood Assessment:", assessment);
} else {
    console.log("❌ No mood assessment data found");
}

// Check today's date format
const today = new Date();
today.setHours(0, 0, 0, 0);
const todayDateString = today.toISOString().split('T')[0];
console.log("📅 Today's date string:", todayDateString);
console.log("📅 Current time:", new Date().toISOString());

// Check if today's mood exists
if (dashboardData) {
    const data = JSON.parse(dashboardData);
    const todayMood = data.moodTrend.find(day => day.date === todayDateString);
    console.log("🎯 Today's mood entry:", todayMood);
    
    // Show all mood entries with dates
    console.log("📋 All mood entries:");
    data.moodTrend.forEach((entry, index) => {
        console.log(`  ${index}: Date: ${entry.date}, Mood: ${entry.mood}`);
    });
} else {
    console.log("❌ Cannot check today's mood - no dashboard data");
}

// Check mood assessment status
const allLocalStorageKeys = [];
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.includes('koru')) {
        allLocalStorageKeys.push({
            key: key,
            value: localStorage.getItem(key)
        });
    }
}
console.log("🔑 All Koru localStorage keys:", allLocalStorageKeys);

// Test mood assessment logic
console.log("\n🧪 Testing mood assessment logic:");
const testUserId = 'test-user';
const key = `koru-last-mood-check-${testUserId}`;
const lastCheck = localStorage.getItem(key);
console.log(`Last mood check for ${testUserId}:`, lastCheck);

if (lastCheck) {
    const lastCheckDate = new Date(lastCheck);
    const todayForComparison = new Date();
    
    lastCheckDate.setHours(0, 0, 0, 0);
    todayForComparison.setHours(0, 0, 0, 0);
    
    console.log('Last check date (normalized):', lastCheckDate.toISOString());
    console.log('Today (normalized):', todayForComparison.toISOString());
    console.log('Should show mood check:', lastCheckDate.getTime() !== todayForComparison.getTime());
}

console.log("=== END DEBUG ===");
