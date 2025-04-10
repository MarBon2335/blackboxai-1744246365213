// Elements
const batteryIcon = document.getElementById('batteryIcon');
const batteryStatus = document.getElementById('batteryStatus');
const batteryLevel = document.getElementById('batteryLevel');
const batteryPercentage = document.getElementById('batteryPercentage');
const chargingStatus = document.getElementById('chargingStatus');
const notificationStatus = document.getElementById('notificationStatus');
const minBatteryLevel = document.getElementById('minBatteryLevel');

// Configuration
let notificationsEnabled = false;
let lastNotificationTime = 0;
const NOTIFICATION_COOLDOWN = 60000; // 1 minute cooldown between notifications

// Battery icons based on level
const batteryIcons = {
    charging: 'fa-battery-bolt',
    level100: 'fa-battery-full',
    level75: 'fa-battery-three-quarters',
    level50: 'fa-battery-half',
    level25: 'fa-battery-quarter',
    level0: 'fa-battery-empty'
};

// Update battery icon based on level and charging status
function updateBatteryIcon(level, isCharging) {
    batteryIcon.innerHTML = '';
    const icon = document.createElement('i');
    icon.className = 'fas';
    
    if (isCharging) {
        icon.classList.add(batteryIcons.charging);
        icon.classList.add('animate-pulse');
    } else {
        if (level >= 87.5) icon.classList.add(batteryIcons.level100);
        else if (level >= 62.5) icon.classList.add(batteryIcons.level75);
        else if (level >= 37.5) icon.classList.add(batteryIcons.level50);
        else if (level >= 12.5) icon.classList.add(batteryIcons.level25);
        else icon.classList.add(batteryIcons.level0);
    }
    
    batteryIcon.appendChild(icon);
}

// Request notification permissions
async function requestNotificationPermission() {
    try {
        const permission = await Notification.requestPermission();
        notificationsEnabled = permission === 'granted';
        updateNotificationStatus();
    } catch (error) {
        console.error('Error requesting notification permission:', error);
        notificationsEnabled = false;
        updateNotificationStatus();
    }
}

// Update notification status display
function updateNotificationStatus() {
    notificationStatus.textContent = notificationsEnabled 
        ? 'Notificaciones activadas' 
        : 'Notificaciones desactivadas';
    notificationStatus.className = `text-sm font-semibold ${
        notificationsEnabled ? 'text-green-600' : 'text-red-600'
    }`;
}

// Show notification
function showNotification(title, body) {
    const now = Date.now();
    if (notificationsEnabled && (now - lastNotificationTime) > NOTIFICATION_COOLDOWN) {
        new Notification(title, {
            body: body,
            icon: '/favicon.ico'
        });
        lastNotificationTime = now;
    }
}

// Update battery UI
function updateBatteryUI(battery) {
    const level = Math.floor(battery.level * 100);
    const isCharging = battery.charging;
    
    // Update battery level display
    batteryPercentage.textContent = `${level}%`;
    batteryLevel.style.width = `${level}%`;
    
    // Update charging status
    chargingStatus.textContent = isCharging ? 'Cargando' : 'No cargando';
    
    // Update battery icon
    updateBatteryIcon(level, isCharging);
    
    // Update status message
    let statusMessage = `Nivel de batería: ${level}%`;
    if (isCharging) {
        statusMessage += ' - Cargando';
        if (level >= 100) {
            statusMessage += ' - ¡Batería completa!';
            showNotification(
                '¡Batería Completa!',
                'Tu dispositivo está completamente cargado. Puedes desconectarlo.'
            );
        }
    } else if (level <= parseInt(minBatteryLevel.value)) {
        statusMessage += ' - ¡Batería baja!';
        showNotification(
            '¡Batería Baja!',
            `El nivel de batería ha llegado al ${level}%. Conecta tu dispositivo.`
        );
    }
    batteryStatus.textContent = statusMessage;
    
    // Update UI colors based on battery level
    if (level <= parseInt(minBatteryLevel.value)) {
        batteryLevel.classList.remove('bg-purple-600');
        batteryLevel.classList.add('bg-red-600');
    } else {
        batteryLevel.classList.remove('bg-red-600');
        batteryLevel.classList.add('bg-purple-600');
    }
}

// Initialize battery monitoring
async function initBatteryMonitor() {
    try {
        // Check if Battery API is supported
        if (!('getBattery' in navigator)) {
            throw new Error('Battery API no soportada en este navegador');
        }
        
        // Request notification permission
        await requestNotificationPermission();
        
        // Get battery manager
        const battery = await navigator.getBattery();
        
        // Initial update
        updateBatteryUI(battery);
        
        // Add event listeners
        battery.addEventListener('levelchange', () => updateBatteryUI(battery));
        battery.addEventListener('chargingchange', () => updateBatteryUI(battery));
        
        // Add event listener for minimum battery level changes
        minBatteryLevel.addEventListener('change', () => updateBatteryUI(battery));
        
    } catch (error) {
        console.error('Error:', error);
        batteryStatus.textContent = error.message;
        batteryStatus.classList.add('text-red-600');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initBatteryMonitor);
