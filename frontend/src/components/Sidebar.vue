<script setup lang="ts">
import { ref } from 'vue'
const activeView = ref('my-tasks')
</script>
<template>
    <aside class="dashboard-sidebar">
        <div class="sidebar-section">
          <h3 class="sidebar-title">Workspace</h3>
          <ul class="sidebar-menu">
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

<router-link to="/dashboard">
            <li class="sidebar-menu-item" :class="{ active: activeView === 'dashboard' }" @click="activeView = 'dashboard'">
              <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 10.5h6M5 6.5h10M9 14.5h2M4 4h12c.5523 0 1 .44772 1 1v10c0 .5523-.4477 1-1 1H4c-.55228 0-1-.4477-1-1V5c0-.55228.44772-1 1-1Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>Dashboard</span>
            </li>
            </router-link>
          </ul>
      </div>
      </aside> 
</template>

<style >
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
}

.sidebar-section {
  padding: 16px 8px;
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

.dashboard-main {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}
</style>