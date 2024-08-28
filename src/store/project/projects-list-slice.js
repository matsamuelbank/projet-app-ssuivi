import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Création du slice pour la liste des projets
export const projectsListSlice = createSlice({
  name: 'projectsList',
  initialState: {
    projects: []
  },
  reducers: {
    setProjectsList: (state, action) => {
      state.projects = action.payload;
    },
    clearProjectList: (state) => {
      state.projects = []; 
  }
  },
});

// Exportation des actions générées par le slice
export const { setProjectsList,clearProjectList } = projectsListSlice.actions;

// Thunk pour récupérer la liste simplifiée des projets
export function fetchProjectsList() {
  return async (dispatch, getState) => {
    const state = getState();
    const token = state.USERINFO.userInfo.token; // Obtenir le token du store

    try {
      const response = await axios.get('http://localhost:3001/api/project/listproject', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response.data); // Vérifie ce qui est retourné par l'API
      dispatch(setProjectsList(response.data));
    } catch (error) {
      console.error('Failed to fetch projects list:', error);
    }
  };
}


// Exportation du reducer du slice
export const projectsListReducer = projectsListSlice.reducer;
