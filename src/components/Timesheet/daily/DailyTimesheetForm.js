import React, { useState, useEffect } from 'react';
import { Paper, Typography, Table, InputLabel, TableHead, TableBody, TableRow, TableCell, Select, MenuItem, Grid, FormControl, TextField } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { PAYMEMPLOYEE, TIMECARD } from '../../../serverconfiguration/controllers';
import { useNavigate } from 'react-router-dom';
import { getRequest } from '../../../serverconfiguration/requestcomp';
import { ServerConfig } from '../../../serverconfiguration/serverconfig';

function filterUniqueObjects(array, propertyName) {
  return array.filter((obj, index, self) =>
    index === self.findIndex((t) => (
      t[propertyName] === obj[propertyName]
    ))
  );
}

const DailyTimesheetForm = () => {
  // Simulated dropdown options
  const navigate = useNavigate();
  const [company, setCompany] = useState([]);
  const [branch, setBranch] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [timeCard, setTimeCard] = useState([]);
  const [pnCompanyid, setCompanyid] = useState("");
  const [pnBranchid, setBranchid] = useState("");
  const [employeeCode, setEmployeecode] = useState("");
  const [employeeName, setEmployeename] = useState("");
  const [empCode, setEmpcode] = useState("");
  const [empName, setEmpname] = useState("");
  const [dates, setDates] = useState("");
  const [days, setDays] = useState("");
  const [intime, setIntime] = useState("");
  const [breakOut, setBreakout] = useState("");
  const [breakIn, setBreakin] = useState("");
  const [earlyOut, setEarlyout] = useState("");
  const [outtime, setOuttime] = useState("");
  const [lateIn, setLatein] = useState("");
  const [lateOut, setLateout] = useState("");
  const [otHrs, setOthrs] = useState("");
  const [status, setStatus] = useState("");
  const [CurrentDay, setCurrentDay] = useState("");
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });

  useEffect(() => {
    async function getData() {
      const employeeData = await getRequest(ServerConfig.url, PAYMEMPLOYEE);
      setEmployee(employeeData.data);
      const timeCardData = await getRequest(ServerConfig.url, TIMECARD);
      setTimeCard(timeCardData.data);
    }
    getData();
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDay(today.toLocaleDateString('en-US', options));
  }, []);

  const dateToDay = (dateString) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(dateString);
    const dayIndex = date.getDay();
    return days[dayIndex];
  };


  const currentDateEntries = timeCard.filter(entry => entry.dates === currentDate);
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Paper elevation={3} style={{ padding: 20, maxWidth: 1100 }}>
        <Typography variant="h5" gutterBottom>
          Daily Time sheet - {CurrentDay}
        </Typography>
        <Grid container spacing={2}>
          {/* Company ID and Branch ID */}
          <Grid item xs={6} sm={6}>
            <FormControl fullWidth>
              <InputLabel shrink>Company</InputLabel>
              <select
                name="pnCompanyId"
                onChange={(e) => {
                  // setCompany(e.target.value)
                }}
                style={{ height: '50px' }}
              >
                <option value="">Select</option>
                {employee.map((e) => (
                  <option>{e.pnCompanyId}</option>
                ))}
              </select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={6}>
            <FormControl fullWidth>
              <InputLabel shrink>Branch</InputLabel>
              <select name="pnBranchId" style={{ height: '50px' }}>
                <option value="">Select</option>
                {employee.map((e) => (
                  <option>{e.pnBranchId}</option>

                ))}

              </select>
            </FormControl>
          </Grid>

          {/* Employee Code and Employee Name */}
          <Grid item xs={6} sm={6}>
            <FormControl fullWidth>
              <InputLabel shrink>EmpCode</InputLabel>
              <select
                name="empcode"
                onChange={(e) => {
                  const selectedEmpCode = e.currentTarget.value;
                  setEmpcode(selectedEmpCode);
                  const selectedEmployee = employee.find((e) => e.employeeCode === selectedEmpCode);
                  if (selectedEmployee) {
                    setEmployeename(selectedEmployee.employeeFullName);
                  }
                }}
                style={{ height: '50px' }}
              >
                <option value="">Select</option>
                {employee.map((e) => (
                  <option key={e.employeeCode}>{e.employeeCode}</option>
                ))}
              </select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={6}>
            <FormControl fullWidth>
              <TextField
                name="pnEmployeeName"
                value={employeeName}
                label="Employee Name"
                variant="outlined"
                fullWidth
                required
              />
            </FormControl>
          </Grid>
        </Grid>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Day</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Intime</TableCell>
              <TableCell>Outtime</TableCell>
              <TableCell>Late In</TableCell>
              <TableCell>Late Out</TableCell>
              <TableCell>Break In</TableCell>
              <TableCell>Break Out</TableCell>
              <TableCell>Ot Hours</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
           <TableBody>
           {currentDateEntries.map((entry) => (
              <TableRow key={entry.sno}>
                <TableCell>{dateToDay(entry.dates)}</TableCell>
                <TableCell>{entry.dates}</TableCell>
                <TableCell>{entry.intime}</TableCell>
                <TableCell>{entry.outtime}</TableCell>
                <TableCell>{entry.lateIn}</TableCell>
                <TableCell>{entry.lateOut}</TableCell>
                <TableCell>{entry.breakIn}</TableCell>
                <TableCell>{entry.breakOut}</TableCell>
                <TableCell>{entry.otHrs}</TableCell>
                <TableCell>{entry.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
};

export default DailyTimesheetForm;
