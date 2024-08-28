// import React, { useEffect, useState } from 'react';
// import { useNavigate } from "react-router-dom";
// import { useSelector } from 'react-redux';
// import axios from 'axios';
// import List from '@mui/material/List';
// import IconButton from '@mui/material/IconButton';
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import AddIcon from '@mui/icons-material/Add';
// import { ProjectItem } from '../ProjectItem/ProjectItem';

// export function ProjectList() {
//   const navigate = useNavigate();
//   const [listProject, setListProjet] = useState([]);
  
//   // Récupération du token utilisateur
//   const userInfo = useSelector((store) => store.USERINFO.userInfo);
//   const token = userInfo?.token;

//   const handleAddProject = () => {
//     navigate('/accueil/add-project');
//   };

//   async function getListProject() {
//     try {
//       const response = await axios.get("http://localhost:3001/api/project/listproject", {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       setListProjet(response.data);
//     } catch (error) {
//       console.error('Erreur lors de la récupération des projets:', error);
//     }
//   }

//   useEffect(() => {
//     getListProject();
//     const ProjectListStore = ''

//   }, []);

//   return (
//     <Box>
//       <Typography variant="h4" gutterBottom>Liste des Projets</Typography>
//       <List>
//         {listProject.map((project) => (
//           <ProjectItem 
//             key={project._id}
//             nameProject={project.nameProject}
//             descriptionProject={project.descriptionProject}
//             startDate={new Date(project.startDateProject).toLocaleDateString('fr-FR')}
//             limitDate={new Date(project.endDateProject).toLocaleDateString('fr-FR')}
//             creatorUser={`${project.idUserCreator.prenom} ${project.idUserCreator.nom}`}
//             buttonText="En savoir plus"
//           />
//         ))}
//       </List>
//       <IconButton 
//         color="primary" 
//         onClick={handleAddProject} 
//         style={{ position: 'fixed', bottom: 16, right: 16 }}
//       >
//         <AddIcon />
//       </IconButton>
//     </Box>
//   );
// }


import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProjectsList } from '../../store/project/projects-list-slice'; // Ajuste le chemin si nécessaire
import { ProjectItem } from '../ProjectItem/ProjectItem';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';

export function ProjectList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { id } = useParams();
  const projects = useSelector((state) => state.PROJECTS_LIST.projects);

  useEffect(() => {
    dispatch(fetchProjectsList());
  }, [dispatch]);

  const handleAddProject = () => {
    navigate('/accueil/add-project');
  };

  const handleViewDetails = (id) => {
    navigate(`/accueil/project-details/${id}`);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Liste des Projets</Typography>
      <List>
        {projects.map((project) => (
          <ProjectItem
            key={project._id}
            nameProject={project.nameProject}
            descriptionProject={project.descriptionProject}
            startDate={project.startDateProject}
            limitDate={project.endDateProject}
            creatorUser={project.idUserCreator.prenom +" "+project.idUserCreator.nom} // Assume que le nom du créateur est déjà inclus
            buttonText="En savoir plus"
            onClick={() => handleViewDetails(project._id)} // Ajout d'un handler pour redirection
          />
        ))}
      </List>
      <IconButton 
        color="primary" 
        onClick={handleAddProject} 
        style={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <AddIcon />
      </IconButton>
    </Box>
  );
}
