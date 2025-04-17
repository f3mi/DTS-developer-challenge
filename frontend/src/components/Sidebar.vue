<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const activeView = ref('my-tasks')
const showLogoutConfirm = ref(false)
const logoutSuccess = ref(false)

// Get user name or email to display
const userDisplayName = computed(() => {
  if (!authStore.user) return 'User'
  return authStore.user.name || authStore.user.email.split('@')[0]
})

// Initials for avatar
const userInitials = computed(() => {
  if (!authStore.user?.name) return 'U'
  return authStore.user.name.split(' ')
    .map(name => name.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2)
})

// Show logout confirmation dialog
const confirmLogout = () => {
  showLogoutConfirm.value = true
}

// Cancel logout
const cancelLogout = () => {
  showLogoutConfirm.value = false
}

// Proceed with logout
const logout = async () => {
  // Clear all auth state
  authStore.logout()
  showLogoutConfirm.value = false
  logoutSuccess.value = true
  
  // Show success message briefly before redirecting
  setTimeout(() => {
    logoutSuccess.value = false
    // Force navigation to login page with full page refresh to clear all state
    window.location.href = '/login'
  }, 1500)
}
</script>

<template>
  <aside class="dashboard-sidebar">
    <!-- User Profile Section -->
    <div class="user-profile">
      <div class="user-avatar">{{ userInitials }}</div>
      <div class="user-info">
        <div class="user-name">{{ userDisplayName }}</div>
        <div class="user-role">{{ authStore.user?.role || 'User' }}</div>
      </div>
    </div>

    <div class="sidebar-section">
      <h3 class="sidebar-title">Workspace</h3>
      <ul class="sidebar-menu">
        <router-link to="/dashboard">
          <li class="sidebar-menu-item" :class="{ active: activeView === 'dashboard' }" @click="activeView = 'dashboard'">
            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 10.5h6M5 6.5h10M9 14.5h2M4 4h12c.5523 0 1 .44772 1 1v10c0 .5523-.4477 1-1 1H4c-.55228 0-1-.4477-1-1V5c0-.55228.44772-1 1-1Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Dashboard</span>
          </li>
        </router-link>

        <router-link to="/tasks">
          <li class="sidebar-menu-item" :class="{ active: activeView === 'my-tasks' }" @click="activeView = 'my-tasks'">
            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 5.5h8M7.5 9.5h5M7.5 13.5h8M4.5 5.5v0M4.5 9.5v0M4.5 13.5v0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>My Tasks</span>
          </li>
        </router-link>

        <router-link to="/calender">
          <li class="sidebar-menu-item" :class="{ active: activeView === 'calendar' }" @click="activeView = 'calendar'">
            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 5V3M14 5V3M3 7h14M4 4h12c.5523 0 1 .44772 1 1v12c0 .5523-.4477 1-1 1H4c-.55228 0-1-.4477-1-1V5c0-.55228.44772-1 1-1Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Calendar</span>
          </li>
        </router-link>

        <router-link to="/reports">
          <li class="sidebar-menu-item" :class="{ active: activeView === 'reports' }" @click="activeView = 'reports'">
            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 16V8M12 16V4M8 16v-5M4 16v-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Reports</span>
          </li>
        </router-link>
      </ul>
    </div>

    <!-- Logout Section -->
    <div class="sidebar-footer">
      <button @click="confirmLogout" class="logout-button">
        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 8.5V6.5C13 4.29086 11.2091 2.5 9 2.5H5C2.79086 2.5 1 4.29086 1 6.5V13.5C1 15.7091 2.79086 17.5 5 17.5H9C11.2091 17.5 13 15.7091 13 13.5V11.5M7 10H19M19 10L16 7M19 10L16 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>Logout</span>
      </button>
    </div>
  </aside>

  <!-- Logout Confirmation Dialog -->
  <div v-if="showLogoutConfirm" class="modal-overlay">
    <div class="modal-container">
      <div class="modal-header">
        <h3>Log Out</h3>
      </div>
      <div class="modal-body">
        <p>Are you sure you want to log out?</p>
      </div>
      <div class="modal-footer">
        <button @click="cancelLogout" class="button-secondary">Cancel</button>
        <button @click="logout" class="button-primary">Log Out</button>
      </div>
    </div>
  </div>

  <!-- Logout Success Message -->
  <div v-if="logoutSuccess" class="modal-overlay">
    <div class="modal-container success">
      <div class="success-icon">✓</div>
      <h3>Logged Out Successfully</h3>
      <p>Redirecting to login page...</p>
    </div>
  </div>
</template>

<style scoped>
.dashboard-task {
  min-height: 100vh;
  background-color: #f6f7fb;
  display: flex;
  flex-direction: column;
}

.dashboard-layout {
  display: flex;
  flex: 1;
}

.dashboard-sidebar {
  width: 240px;
  background-color: white;
  border-right: 1px solid #e6e9ef;
  height: calc(100vh - 56px);
  position: sticky;
  top: 56px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.user-profile {
  padding: 16px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e6e9ef;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #1976d2;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  margin-right: 12px;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-weight: 500;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 12px;
  color: #676879;
  text-transform: capitalize;
}

.sidebar-section {
  padding: 16px 8px;
  flex: 1;
}

.sidebar-title {
  font-size: 14px;
  font-weight: 500;
  color: #676879;
  padding: 0 8px;
  margin: 0 0 8px 0;
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-menu-item {
  display: flex;
  align-items: center;
  padding: 8px;
  color: #323338;
  border-radius: 4px;
  margin-bottom: 2px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.sidebar-menu-item:hover {
  background-color: #f5f6f8;
}

.sidebar-menu-item.active {
  background-color: #ddf1ff;
  color: #0073ea;
  font-weight: 500;
}

.sidebar-menu-item svg {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid #e6e9ef;
}

.logout-button {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px;
  background: none;
  border: none;
  color: #676879;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  font-size: 14px;
}

.logout-button:hover {
  background-color: #f0f0f0;
  color: #e91e63;
}

.logout-button svg {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

.dashboard-main {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.modal-header {
  padding: 16px 24px;
  border-bottom: 1px solid #e6e9ef;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e6e9ef;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.button-secondary {
  padding: 8px 16px;
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.button-secondary:hover {
  background-color: #e0e0e0;
}

.button-primary {
  padding: 8px 16px;
  background-color: #e91e63;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.button-primary:hover {
  background-color: #d81b60;
}

/* Success Message */
.modal-container.success {
  padding: 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.success-icon {
  width: 48px;
  height: 48px;
  background-color: #4caf50;
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  margin-bottom: 16px;
}

.modal-container.success h3 {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 500;
  color: #2e7d32;
}

.modal-container.success p {
  margin: 0;
  color: #388e3c;
}
</style>