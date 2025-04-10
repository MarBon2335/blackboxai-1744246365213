// Elements
const batteryIcon = document.getElementById('batteryIcon');
const batteryStatus = document.getElementById('batteryStatus');
const batteryLevel = document.getElementById('batteryLevel');
const batteryPercentage = document.getElementById('batteryPercentage');
const chargingStatus = document.getElementById('chargingStatus');
const notificationStatus = document.getElementById('notificationStatus');
const minBatteryLevel = document.getElementById('minBatteryLevel');
const statusImage = document.getElementById('statusImage');
const soundToggle = document.getElementById('soundToggle');
const vibrationToggle = document.getElementById('vibrationToggle');
const testNotificationBtn = document.getElementById('testNotification');

// Configuration
let notificationsEnabled = false;
let lastNotificationTime = 0;
const NOTIFICATION_COOLDOWN = 60000; // 1 minute cooldown between notifications
const NOTIFICATION_SOUND = new Audio('data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=');

// User preferences
const userPreferences = {
    notificationsEnabled: false,
    minBatteryLevel: 20,
    soundEnabled: true,
    vibrationEnabled: true,
    
    // Load preferences from localStorage
    load() {
        const saved = localStorage.getItem('batteryPreferences');
        if (saved) {
            const prefs = JSON.parse(saved);
            this.notificationsEnabled = prefs.notificationsEnabled;
            this.minBatteryLevel = prefs.minBatteryLevel;
            this.soundEnabled = prefs.soundEnabled;
            this.vibrationEnabled = prefs.vibrationEnabled;
            
            // Update UI
            minBatteryLevel.value = this.minBatteryLevel;
            notificationsEnabled = this.notificationsEnabled;
            updateNotificationStatus();
        }
    },
    
    // Save preferences to localStorage
    save() {
        localStorage.setItem('batteryPreferences', JSON.stringify({
            notificationsEnabled: this.notificationsEnabled,
            minBatteryLevel: this.minBatteryLevel,
            soundEnabled: this.soundEnabled,
            vibrationEnabled: this.vibrationEnabled
        }));
    }
};

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

// Toggle notifications
function toggleNotifications() {
    if (notificationsEnabled) {
        notificationsEnabled = false;
        userPreferences.notificationsEnabled = false;
    } else {
        requestNotificationPermission();
    }
    userPreferences.save();
    updateNotificationStatus();
}

// Request notification permissions
async function requestNotificationPermission() {
    try {
        const permission = await Notification.requestPermission();
        notificationsEnabled = permission === 'granted';
        userPreferences.notificationsEnabled = notificationsEnabled;
        userPreferences.save();
        updateNotificationStatus();
        
        // Show test notification if enabled
        if (notificationsEnabled) {
            showNotification(
                'Notificaciones Activadas',
                'Las notificaciones de Carga Centinela están funcionando correctamente.'
            );
        }
    } catch (error) {
        console.error('Error al solicitar permisos de notificación:', error);
        notificationsEnabled = false;
        updateNotificationStatus();
    }
}

// Update notification status display
function updateNotificationStatus() {
    const toggleBtn = document.createElement('button');
    toggleBtn.className = `px-4 py-2 rounded-full ${
        notificationsEnabled ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
    } hover:opacity-80 transition-opacity`;
    toggleBtn.innerHTML = `
        <i class="fas ${notificationsEnabled ? 'fa-bell' : 'fa-bell-slash'} mr-2"></i>
        ${notificationsEnabled ? 'Desactivar' : 'Activar'} Notificaciones
    `;
    toggleBtn.onclick = toggleNotifications;
    
    notificationStatus.innerHTML = '';
    notificationStatus.appendChild(toggleBtn);
}

// Show notification with sound and vibration
function showNotification(title, body, icon = 'fas fa-shield-alt') {
    const now = Date.now();
    if (notificationsEnabled && (now - lastNotificationTime) > NOTIFICATION_COOLDOWN) {
        // Show notification
        new Notification(title, {
            body: body,
            icon: statusImage ? statusImage.src : null,
            badge: '/favicon.ico',
            silent: !userPreferences.soundEnabled
        });
        
        // Play sound if enabled
        if (userPreferences.soundEnabled) {
            NOTIFICATION_SOUND.play();
        }
        
        // Vibrate if enabled and supported
        if (userPreferences.vibrationEnabled && navigator.vibrate) {
            navigator.vibrate([200, 100, 200]);
        }
        
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
        // Load user preferences
        userPreferences.load();
        
        // Check if Battery API is supported
        if (!('getBattery' in navigator)) {
            throw new Error('La API de Batería no está soportada en este navegador');
        }
        
        // Request notification permission if previously enabled
        if (userPreferences.notificationsEnabled) {
            await requestNotificationPermission();
        } else {
            updateNotificationStatus();
        }
        
        // Get battery manager
        const battery = await navigator.getBattery();
        
        // Initial update
        updateBatteryUI(battery);
        
        // Add event listeners
        battery.addEventListener('levelchange', () => updateBatteryUI(battery));
        battery.addEventListener('chargingchange', () => updateBatteryUI(battery));
        
        // Add event listener for minimum battery level changes
        minBatteryLevel.addEventListener('change', () => {
            userPreferences.minBatteryLevel = parseInt(minBatteryLevel.value);
            userPreferences.save();
            updateBatteryUI(battery);
        });

        // Add event listeners for sound and vibration toggles
        soundToggle.checked = userPreferences.soundEnabled;
        vibrationToggle.checked = userPreferences.vibrationEnabled;
        
        soundToggle.addEventListener('change', () => {
            userPreferences.soundEnabled = soundToggle.checked;
            userPreferences.save();
            // Play test sound if enabled
            if (userPreferences.soundEnabled) {
                NOTIFICATION_SOUND.play();
            }
        });
        
        vibrationToggle.addEventListener('change', () => {
            userPreferences.vibrationEnabled = vibrationToggle.checked;
            userPreferences.save();
            // Test vibration if enabled
            if (userPreferences.vibrationEnabled && navigator.vibrate) {
                navigator.vibrate(200);
            }
        });
        
        // Add event listener for test notification button
        testNotificationBtn.addEventListener('click', () => {
            if (notificationsEnabled) {
                showNotification(
                    'Prueba de Notificación',
                    'Las notificaciones están funcionando correctamente'
                );
            } else {
                requestNotificationPermission();
            }
        });
        
    } catch (error) {
        console.error('Error:', error);
        batteryStatus.textContent = error.message;
        batteryStatus.classList.add('text-red-600');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initBatteryMonitor);
