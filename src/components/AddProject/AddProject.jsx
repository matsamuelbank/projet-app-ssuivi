
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export function AddProject() {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [files, setFiles] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [tasks, setTasks] = useState([{ name: '', description: '', dueDate: null, assignedUsers: [] }]);
  const [userList, setUserList] = useState([]);
  const userInfo = useSelector((store) => store.USERINFO.userInfo);
  const token = userInfo.token;
  const userId = userInfo.userId;

  const resetForm = () => {
    setProjectName('');
    setDescription('');
    setStartDate(null);
    setEndDate(null);
    setFiles([]);
    setAssignedUsers([]);
    setTasks([{ name: '', description: '', dueDate: null, assignedUsers: [] }]);
  };

  async function getUserList() {
    try {
      const response = await axios.get('http://localhost:3001/api/user/listuser', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      });
      setUserList(response.data);

      console.log("liste des utilisateurs de l'app : ",response.data)
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
    }
  }

  useEffect(() => {
    getUserList();
  }, []);

  const handleAddTask = () => {
    setTasks([...tasks, { name: '', description: '', dueDate: null, assignedUsers: [] }]);
  };

  const handleRemoveTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const handleFileChange = (e) => {
    setFiles([...files, ...Array.from(e.target.files)]);
  };

  const handleRemoveFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };

  const handleAssignedUsersChange = (e) => {
    const newAssignedUsers = e.target.value;
    setAssignedUsers(newAssignedUsers);
  };

  async function addProject(event) {
    event.preventDefault();
    const formattedStartDate = startDate ? dayjs(startDate).format('YYYY-MM-DD') : '';
    const formattedEndDate = endDate ? dayjs(endDate).format('YYYY-MM-DD') : '';

    const taskData = tasks.map((task) => ({
        nameTask: task.name,
        descriptionTask: task.description,
        dueDateTask: task.dueDate ? dayjs(task.dueDate).format('YYYY-MM-DD') : '',
        assignedUsersTask: task.assignedUsers,
    }));

    const formData = new FormData();
    formData.append('nameProject', projectName);
    formData.append('descriptionProject', description);
    formData.append('startDateProject', formattedStartDate);
    formData.append('endDateProject', formattedEndDate);
    formData.append('idUserCreator', userId);

    files.forEach((file) => {
        formData.append('files', file);
    });

    assignedUsers.forEach(userId => formData.append('assignedUsersProject[]', userId)); // ajoute dans le formdata un tableau nommé assignedUsersProject(donc un tableau d'id)
    formData.append('tasks', JSON.stringify(taskData));

    console.log(formData)

    try {
        const response = await axios.post('http://localhost:3001/api/project/addProject', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + token
            }
        });
        console.log('Réponse de l\'API:', response.data);

        resetForm (); //vide tous les champs apres l'ajout d'un nouveau projet 
    } catch (error) {
        console.error('Erreur lors de la création du projet:', error);
    }
  }

  return (
    <Box component="form" sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      <Typography variant="h4" gutterBottom>Créer un Nouveau Projet</Typography>
      <TextField 
        label="Nom du Projet" 
        value={projectName} 
        onChange={(e) => setProjectName(e.target.value)} 
        fullWidth 
        margin="normal"
      />
      <TextField 
        label="Description" 
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
        multiline 
        rows={4} 
        fullWidth 
        margin="normal"
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Date de Début"
          value={startDate}
          onChange={(date) => setStartDate(date)}
          slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
        />
        <DatePicker
          label="Date de Fin"
          value={endDate}
          onChange={(date) => setEndDate(date)}
          slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
        />
      </LocalizationProvider>
      <Box my={2}>
        {/* <input type="file" multiple onChange={handleFileChange} /> */}
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
          onChange={handleFileChange}
        >
          Ajouter des fichiers
          <VisuallyHiddenInput type="file" />
        </Button>
        <Box mt={2}>
          {files.length === 0 ? 'Aucun fichier ajouté' : ''}
        </Box>
        {files.map((file, index) => (
          <Box key={index} display="flex" alignItems="center" mt={1}>
            <Typography>{file.name}</Typography>
            <IconButton onClick={() => handleRemoveFile(index)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
      </Box>
      
      <Select 
        multiple 
        value={assignedUsers} 
        onChange={handleAssignedUsersChange}
        fullWidth 
        margin="dense"
      >
        {userList && userList.map((user) => (
          <MenuItem key={user._id} value={user._id}>
            {user.prenom + " " + user.nom}
          </MenuItem>
        ))}
      </Select>
      {tasks.map((task, index) => (
        <Box key={index} my={2}>
          <TextField
            label="Nom de la Tâche" 
            value={task.name} 
            onChange={(e) => {
              const newTasks = [...tasks];
              newTasks[index].name = e.target.value;
              setTasks(newTasks);
            }} 
            fullWidth 
            margin="normal"
          />
          <TextField 
            label="Description de la Tâche" 
            value={task.description} 
            onChange={(e) => {
              const newTasks = [...tasks];
              newTasks[index].description = e.target.value;
              setTasks(newTasks);
            }} 
            multiline 
            rows={2} 
            fullWidth 
            margin="normal"
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date Limite"
              value={task.dueDate}
              onChange={(date) => {
                const newTasks = [...tasks];
                newTasks[index].dueDate = date;
                setTasks(newTasks);
              }}
              slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
            />
          </LocalizationProvider>
          <Select 
            multiple 
            value={task.assignedUsers} 
            onChange={(e) => {
              const newTasks = [...tasks];
              newTasks[index].assignedUsers = e.target.value;
              setTasks(newTasks);
            }} 
            fullWidth 
            margin="dense"
          >
            {userList && userList.map((user) => (
              <MenuItem key={user._id} value={user._id}>
                {user.prenom + " " + user.nom}
              </MenuItem>
            ))}
          </Select>
          <IconButton onClick={() => handleRemoveTask(index)} color="secondary">
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}
      <Box mt={2}>
        <Button onClick={handleAddTask} variant="outlined" color="primary" fullWidth>Ajouter une Tâche</Button>
      </Box>
      <Box mt={2} display="flex" justifyContent="space-between">
        <Button onClick={addProject} variant="contained" color="primary">Enregistrer</Button>
        <Button variant="outlined">Annuler</Button> 
      </Box>
    </Box>
  );
}