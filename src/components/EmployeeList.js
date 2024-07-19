// components/EmployeeList.js
import React, { useState, useEffect } from 'react';
import { 
  Container, Paper, List, ListItem, ListItemText, IconButton, Typography, 
  Button, CircularProgress
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const employeesCollection = collection(db, `admins/${auth.currentUser.uid}/employees`);
      const employeeSnapshot = await getDocs(employeesCollection);
      const employeeList = employeeSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
      setEmployees(employeeList);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Failed to fetch employees. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await deleteDoc(doc(db, `admins/${auth.currentUser.uid}/employees`, id));
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
      setError('Failed to delete employee. Please try again later.');
    }
  };

  if (isLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ mt: 4, p: 2 }}>
        <Typography variant="h4" gutterBottom>
          Employee List
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={() => navigate('/employee/add')}
          sx={{ mb: 2 }}
        >
          Add New Employee
        </Button>
        {employees.length === 0 ? (
          <Typography align="center">No employees found. Add some!</Typography>
        ) : (
          <List>
            {employees.map((employee) => (
              <ListItem 
                key={employee.id}
                secondaryAction={
                  <>
                    <IconButton edge="end" aria-label="edit" onClick={() => navigate(`/employee/edit/${employee.id}`)}>
                      <Edit />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => deleteEmployee(employee.id)}>
                      <Delete />
                    </IconButton>
                  </>
                }
              >
                <ListItemText 
                  primary={employee.name} 
                  secondary={`${employee.position} - $${employee.salary}`} 
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
}

export default EmployeeList;