import * as React from 'react';
import axios from 'axios';
import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import { useNavigate, Link } from 'react-router-dom';
import style from './style.module.css';

export function RegisterPage() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [identifiant, setIdentifiant] = useState('');
  const [motDePasse, setMotDePasse] = useState('');

  const handleRegister = async (event) => {
    event.preventDefault();
    const userInfo = {
      nom,
      prenom,
      langue: language,
      identifiant,
      motDePasse,
    };

    console.log(userInfo)
  
    try {
      const response = await axios.post('http://localhost:3001/api/user/signup', userInfo, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Réponse de l\'API:', response.data);
      // Redirige vers la page principale après l'inscription réussie
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      // Gérer les erreurs ici (par exemple, afficher un message d'erreur à l'utilisateur)
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
        onSubmit={handleRegister}
      >
        <TextField
          id="text-name"
          label="Nom"
          variant="outlined"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
        />
        <TextField
          id="text-firstname"
          label="Prénom"
          variant="outlined"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
        />
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-helper-label">Langue</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="text-selected-language"
            value={language}
            label="Langue"
            onChange={(e)=> setLanguage(e.target.value)}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value='Français'>Français</MenuItem>
            <MenuItem value='Anglais'>Anglais</MenuItem>
            <MenuItem value='Espagnol'>Espagnol</MenuItem>
          </Select>
        </FormControl>
        <TextField
          id="text-user-identifiant"
          label="Identifiant"
          variant="outlined"
          value={identifiant}
          onChange={(e) => setIdentifiant(e.target.value)}
        />
        <TextField
          id="text-user-password"
          label="Mot de passe"
          type="password"
          autoComplete="current-password"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
        />
        <Button variant="contained" color="primary" type="submit">
          S'inscrire
        </Button>
        <Button component={Link} to="/login" variant="text">
          Déjà inscrit ? Connectez-vous
        </Button>
      </Box>
    </div>
  );
}
