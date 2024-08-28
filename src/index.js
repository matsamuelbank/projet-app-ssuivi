import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './index.css';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import App from './App';
import { LoginPage } from './components/LoginPage/LoginPage';
import { RegisterPage } from './components/RegisterPage/RegisterPage';
import { ProjectList } from './components/ProjectList/ProjectList';
import { NotificationList } from './components/NotificationList/NotificationList';
import { TaskList } from './components/TaskList/TaskList';
import { GlobalView } from './components/GlobalView/GlobalView';
import { UserPrivateRoute } from './components/PrivateRoute/UserPrivateRoute';
import { AddProject } from './components/AddProject/AddProject';
import { Project } from './components/Project/Project';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/accueil" element={<UserPrivateRoute element={<App />} />}>
            <Route path="projects" element={<ProjectList />} />
            <Route path="tasks" element={<TaskList />} />
            <Route path="global-view" element={<GlobalView />} />
            <Route path="notifications" element={<NotificationList />} />
            <Route path="add-project" element={<AddProject />} />
            <Route path="project-details/:id" element={<Project />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </PersistGate>
  </Provider>
);
