// Elements
const batteryIcon = document.getElementById('batteryIcon');
const batteryStatus = document.getElementById('batteryStatus');
const batteryLevel = document.getElementById('batteryLevel');
const batteryPercentage = document.getElementById('batteryPercentage');
const chargingStatus = document.getElementById('chargingStatus');
const notificationStatus = document.getElementById('notificationStatus');
const minBatteryLevel = document.getElementById('minBatteryLevel');
const statusImage = document.getElementById('statusImage');

// Configuration
let notificationsEnabled = false;
let lastNotificationTime = 0;
const NOTIFICATION_COOLDOWN = 60000; // 1 minute cooldown between notifications

// Battery icons based on level
const batteryIcons = {
    charging: 'fa-bolt',
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
        icon.style.color = '#10B981'; // Green color for charging
    } else {
        if (level >= 87.5) {
            icon.classList.add(batteryIcons.level100);
            icon.style.color = '#10B981'; // Green
        } else if (level >= 62.5) {
            icon.classList.add(batteryIcons.level75);
            icon.style.color = '#10B981'; // Green
        } else if (level >= 37.5) {
            icon.classList.add(batteryIcons.level50);
            icon.style.color = '#FBBF24'; // Yellow
        } else if (level >= 12.5) {
            icon.classList.add(batteryIcons.level25);
            icon.style.color = '#F59E0B'; // Orange
        } else {
            icon.classList.add(batteryIcons.level0);
            icon.style.color = '#EF4444'; // Red
        }
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
        console.error('Error al solicitar permisos de notificación:', error);
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
function showNotification(title, body, icon = 'fas fa-shield-alt') {
    const now = Date.now();
    if (notificationsEnabled && (now - lastNotificationTime) > NOTIFICATION_COOLDOWN) {
        new Notification(title, {
            body: body,
            icon: statusImage ? statusImage.src : null,
            badge: '/favicon.ico'
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
    
    // Update charging status with icon
    chargingStatus.innerHTML = isCharging 
        ? '<i class="fas fa-plug text-green-600 mr-2"></i>Cargando'
        : '<i class="fas fa-power-off text-gray-600 mr-2"></i>Desconectado';
    
    // Update battery icon
    updateBatteryIcon(level, isCharging);
    
    // Update status message and color
    let statusMessage = `Nivel de batería: ${level}%`;
    let statusColor = 'text-gray-600';
    
    if (isCharging) {
        if (level >= 100) {
            statusMessage = '¡Batería completamente cargada!';
            statusColor = 'text-green-600';
            showNotification(
                '¡Carga Completa!',
                'Tu dispositivo está completamente cargado. Puedes desconectarlo.'
            );
        } else {
            statusMessage += ' - Cargando...';
            statusColor = 'text-blue-600';
        }
    } else if (level <= parseInt(minBatteryLevel.value)) {
        statusMessage = `¡Atención! Batería baja (${level}%)`;
        statusColor = 'text-red-600';
        showNotification(
            '¡Batería Baja!',
            `El nivel de batería ha llegado al ${level}%. Conecta tu dispositivo.`
        );
    }
    
    batteryStatus.textContent = statusMessage;
    batteryStatus.className = `text-xl ${statusColor}`;
    
    // Update progress bar color
    batteryLevel.className = `h-full transition-all duration-300 ${
        isCharging ? 'bg-green-500' :
        level <= parseInt(minBatteryLevel.value) ? 'bg-red-500' :
        level <= 30 ? 'bg-orange-500' :
        level <= 60 ? 'bg-yellow-500' :
        'bg-green-500'
    }`;
}

// Initialize battery monitoring
async function initBatteryMonitor() {
    try {
        // Check if Battery API is supported
        if (!('getBattery' in navigator)) {
            throw new Error('La API de Batería no está soportada en este navegador');
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
