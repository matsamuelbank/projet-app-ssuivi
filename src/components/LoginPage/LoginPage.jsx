import * as React from 'react';
import axios from 'axios';
import { useState } from 'react';
import { useDispatch } from "react-redux";
import {addUserInfo} from '../../store/userInfo/user-info-slice'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate,Link } from 'react-router-dom';
import style from './style.module.css';

export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [identifiant, setIdentifiant] = useState('')
  const [motDePasse, setMotDePasse] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault();
    const userInfo = {
      identifiant,
      motDePasse
    };

    try {
      const response = await axios.post('http://localhost:3001/api/user/login', userInfo, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Réponse de l\'API:', response.data);
      // Gestion de la réponse contenant les infos du user
      const resUserInfo = response.data
      // ajout des infos du user dans le store
      dispatch (addUserInfo(resUserInfo))
      navigate('/accueil');
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      // Gérer les erreurs ici (par exemple, afficher un message d'erreur à l'utilisateur)
      console.log("l'erreur est: ",error)
    }
  };

  return (
    <div className={style.container}>
      <Box
        component="form"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          '& > :not(style)': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Connexion
        </Typography>
        <TextField value={identifiant} onChange={(e)=> setIdentifiant(e.target.value)} id="text-identifiant" label="Identifiant" variant="outlined" />
        <TextField value={motDePasse} onChange={(e)=> setMotDePasse(e.target.value)} id="text-motDePasse" label="Mot de passe" type="password" autoComplete="current-password" />
        <Button variant="contained" color="primary" onClick={handleLogin}>
          Se connecter
        </Button>
        <Button component={Link} to="/register" variant="text">
          Pas encore de compte ? inscrivez-vous
        </Button>
      </Box>
    </div>
  );
}

