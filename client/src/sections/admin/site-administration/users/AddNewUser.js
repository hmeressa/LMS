import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import axiosInstance from "../../../../api";
import { EMAIL_REGEX, PHONE_REGEX } from "../../../../utils/constants";

export default function AddNewUserDialog({ openAdd, setOpenAdd, getUsers }) {
  const [teams, setTeams] = useState();
  const [roles, setRoles] = useState();
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);
  const [teamName, setTeamName] = useState(null);
  const [position, setPosition] = useState(null);
  const [gender, setGender] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [roleName, setRoleName] = useState(null);
  const [error, setError] = useState();

  const getTeams = async () => {
    const response = await axiosInstance.post(
      `${process.env.REACT_APP_API_URL}/team/findAll`
    );

    if (response.status === 200) {
      setTeams(response.data);
    }
  };

  const getRoles = async () => {
    const response = await axiosInstance.post(
      `${process.env.REACT_APP_API_URL}/role/findAll`
    );

    if (response.status === 200) {
      setRoles(response.data);
    }
  };

  useEffect(() => {
    getTeams();
    getRoles();
  }, []);

  const validateUser = () => {
    if (firstName === null) {
      setError("First name cannot be empty");
      return false;
    } else if (lastName === null) {
      setError("Last name cannot be empty");
      return false;
    } else if (gender === null) {
      setError("Gender cannot be empty");
      return false;
    } else if (email === null) {
      setError("Email cannot be empty");
      return false;
    } else if (!EMAIL_REGEX.test(email)) {
      setError("Invalid email address");
      return false;
    } else if (phone === null) {
      setError("Phone number cannot be empty");
      return false;
    } else if (!PHONE_REGEX.test(phone)) {
      setError("invalid phone number");
      return false;
    } else if (position === null) {
      setError("Position cannot be empty");
      return false;
    } else if (teamName === null) {
      setError("Team cannot be empty");
      return false;
    } else if (roleName === null) {
      setError("Role cannot be empty");
      return false;
    }

    setError(null);
    return true;
  };

  const handleAdd = async () => {
    const isValid = validateUser();

    if (isValid) {
      setDisabled(true);
      try {
        setDisabled(true);
        const response = await axiosInstance.post(
          `${process.env.REACT_APP_API_URL}/user/register`,
          {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            teamName: teamName,
            position: position,
            gender: gender,
            roleName: roleName,
          }
        );

        if (response.status === 201) {
          setOpenAdd(false);
          getUsers();
          setDisabled(false);
        }
      } catch (e) {
        console.log("add user", e);
        if (e.response.status === 406) {
          setError("There is already a user with this email");
        } else if (e.response.status === 500 || e.response.status === 404) {
          setError("Internal Server Error. Please try again later");
        }
      }
    }
  };

  return (
    <>
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
        <DialogTitle>Add new user</DialogTitle>
        <DialogContent sx={{ width: 500, height: "60vh" }}>
          <Box sx={{ mb: 1 }}>
            {error && (
              <Alert sx={{ width: "100%" }} severity="error">
                {error}
              </Alert>
            )}
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography gutterBottom color="text.secondary">
              First Name
            </Typography>
            <TextField
              type="text"
              fullWidth
              required
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography gutterBottom color="text.secondary">
              Last Name
            </Typography>
            <TextField
              type="text"
              required
              fullWidth
              onChange={(e) => setLastName(e.target.value)}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography gutterBottom color="text.secondary">
              Gender
            </Typography>
            <Select fullWidth onChange={(e) => setGender(e.target.value)}>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </Select>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography gutterBottom color="text.secondary">
              Email
            </Typography>
            <TextField
              required
              type="email"
              fullWidth
              onChange={(e) => setEmail(e.target.value)}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography gutterBottom color="text.secondary">
              Phone
            </Typography>
            <TextField
              type="number"
              required
              fullWidth
              onChange={(e) => setPhone(e.target.value)}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography gutterBottom color="text.secondary">
              Position
            </Typography>
            <Select fullWidth onChange={(e) => setPosition(e.target.value)}>
              <MenuItem value="member">Member</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography gutterBottom color="text.secondary">
              Team
            </Typography>
            <Select fullWidth onChange={(e) => setTeamName(e.target.value)}>
              {teams && teams.length >= 1 ? (
                teams.map((team) => {
                  return (
                    <MenuItem key={team.id} value={team.teamName}>
                      {team.teamName}
                    </MenuItem>
                  );
                })
              ) : (
                <Box sx={{ px: 2, py: 1 }}>
                  You have to register some teams first.
                </Box>
              )}
            </Select>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography gutterBottom color="text.secondary">
              Role
            </Typography>
            <Select fullWidth onChange={(e) => setRoleName(e.target.value)}>
              {roles && roles.length >= 1 ? (
                roles.map((role) => {
                  return (
                    <MenuItem key={role.id} value={role.roleName}>
                      {role.roleName}
                    </MenuItem>
                  );
                })
              ) : (
                <Box sx={{ px: 2, py: 1 }}>
                  You have to register some roles first.
                </Box>
              )}
            </Select>
          </Box>
        </DialogContent>
        <DialogActions>
          <Box sx={{ my: 2, display: "flex", justifyContent: "end" }}>
            <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
            <Button
              size="large"
              variant="contained"
              onClick={handleAdd}
              disabled={disabled}
            >
              Add user
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}
