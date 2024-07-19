// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { AppBar, Toolbar, Typography, Button, Container, CircularProgress } from '@mui/material';
import { auth } from './firebase';
import AuthPage from './components/AuthPage';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const [user, loading] = useAuthState(auth);

  const handleSignOut = () => {
    signOut(auth);
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Employee Management Portal
          </Typography>
          {user ? (
            <>
              <Typography variant="subtitle1" sx={{ mr: 2 }}>
                {user.email}
              </Typography>
              <Button color="inherit" onClick={handleSignOut}>Sign Out</Button>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/auth">Login / Sign Up</Button>
          )}
        </Toolbar>
      </AppBar>
      <Container>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <EmployeeList />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/employee/add" 
            element={
              <PrivateRoute>
                <EmployeeForm />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/employee/edit/:id" 
            element={
              <PrivateRoute>
                <EmployeeForm />
              </PrivateRoute>
            } 
          />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;