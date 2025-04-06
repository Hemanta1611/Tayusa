import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: true,
  darkMode: false,
  notifications: [],
  alert: {
    show: false,
    type: '',
    message: ''
  }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('darkMode', state.darkMode);
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    setAlert: (state, action) => {
      state.alert = {
        show: true,
        ...action.payload
      };
    },
    clearAlert: (state) => {
      state.alert = {
        show: false,
        type: '',
        message: ''
      };
    }
  }
});

export const { 
  toggleSidebar, 
  toggleDarkMode, 
  addNotification, 
  removeNotification,
  setAlert,
  clearAlert
} = uiSlice.actions;

export default uiSlice.reducer;
