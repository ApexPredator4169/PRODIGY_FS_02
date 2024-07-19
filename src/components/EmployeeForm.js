// components/EmployeeForm.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, Paper, TextField, Button, Typography, CircularProgress 
} from '@mui/material';
import { doc, getDoc, setDoc, addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../firebase';

function EmployeeForm() {
  const [employee, setEmployee] = useState({ name: '', position: '', salary: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = id !== undefined;

  useEffect(() => {
    if (isEditMode) {
      fetchEmployee();
    }
  }, [isEditMode, id]);

  const fetchEmployee = async () => {
    setIsLoading(true);
    try {
      const employeeDoc = await getDoc(doc(db, `admins/${auth.currentUser.uid}/employees`, id));
      if (employeeDoc.exists()) {
        setEmployee(employeeDoc.data());
      } else {
        setError('No such employee!');
        navigate('/');
      }
    } catch (error) {
      console.error('Error fetching employee:', error);
      setError('Failed to fetch employee data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (isEditMode) {
        await setDoc(doc(db, `admins/${auth.currentUser.uid}/employees`, id), employee);
      } else {
        await addDoc(collection(db, `admins/${auth.currentUser.uid}/employees`), employee);
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving employee:', error);
      setError('Failed to save employee data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  if (isLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          {isEditMode ? 'Edit Employee' : 'Add New Employee'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Name"
            name="name"
            value={employee.name}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Position"
            name="position"
            value={employee.position}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Salary"
            name="salary"
            type="number"
            value={employee.salary}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : (isEditMode ? 'Update' : 'Add')} Employee
          </Button>
          {error && (
            <Typography color="error" align="center">
              {error}
            </Typography>
          )}
        </form>
      </Paper>
    </Container>
  );
}

export default EmployeeForm;