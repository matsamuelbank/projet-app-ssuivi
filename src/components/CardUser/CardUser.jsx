import Card from 'react-bootstrap/Card';
import { useDispatch } from "react-redux";
import {clearUserInfo} from '../../store/userInfo/user-info-slice'
import {clearProjectList} from '../../store/project/projects-list-slice'
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export function CardUser({ img, nom , prenom}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logout = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/user/logout', {}, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Réponse de l\'API:', response.data);
      // Redirige vers la page de connexion après la déconnexion réussie
      dispatch(clearUserInfo())
      dispatch(clearProjectList())
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // Gérer les erreurs ici (par exemple, afficher un message d'erreur à l'utilisateur)
    }
  };

  return (
    <div>
      <Card style={{ width: '18rem' }}>
        <Card.Img 
          variant="top" 
          src={img} 
          style={{ marginTop: '60%', maxWidth: '50%', maxHeight: '80%', borderRadius: '50%' }} 
        />
        <Card.Body>
          <Card.Title>{nom+" "+prenom}</Card.Title>
          <Button variant="primary" onClick={logout}>Déconnexion</Button>
        </Card.Body>
      </Card>
    </div>
  );
}
