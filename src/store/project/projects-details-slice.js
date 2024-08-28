import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Création du slice pour les détails d'un projet
export const projectDetailsSlice = createSlice({
  name: 'projectDetails',
  initialState: {
    projectDetails: {} // Initialisation de l'état avec un objet vide
  },
  reducers: {
    setProjectDetails: (state, action) => {
      state.projectDetails[action.payload._id] = action.payload; // Mise à jour de l'état avec l'ID du projet comme clé
    },
  },
});

// Exportation des actions générées par le slice
export const { setProjectDetails } = projectDetailsSlice.actions;

// Thunk pour récupérer les détails d'un projet spécifique
export function fetchProjectDetails(id) {
  return async (dispatch, getState) => {
    const state = getState();
    const token = state.USERINFO.userInfo.token; // Assure-toi d'avoir le bon chemin pour accéder au token

    try {
      const response = await axios.get(`http://localhost:3001/api/project/infoproject/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      dispatch(setProjectDetails(response.data));
      console.log(response.data);
    } catch (error) {
      console.error('Failed to fetch project details:', error);
    }
  };
}

// Exportation du reducer du slice
export const projectDetailsReducer = projectDetailsSlice.reducer;
