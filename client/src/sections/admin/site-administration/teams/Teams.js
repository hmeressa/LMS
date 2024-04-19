import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { authContext } from "../../../../App";
import axiosInstance from "../../../../api";
import CustomSnackbar from "../../../../components/alerts/CustomSnackbar";
import EmptyState from "../../../../components/empty-state/EmptyState";
import Header from "../Header";
import TeamCard from "./TeamCard";

export default function Teams() {
  const [teams, setTeams] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [notification, setNotification] = useState({});
  const [newTeamName, setNewTeamName] = useState(null);
  const [newTeamDescription, setNewTeamDescription] = useState(null);
  const [error, setError] = useState(null);
  const [filtered, setFiltered] = useState();
  const [query, setQuery] = useState();
  const { user } = useContext(authContext);

  const getTeams = async () => {
    const response = await axiosInstance.post(
      `${process.env.REACT_APP_API_URL}/team/findAll`
    );

    if (response.status === 200) {
      const sorted = response.data.sort(
        (a, b) => a.teamName.toLowerCase() > b.teamName.toLowerCase()
      );
      setTeams(sorted);
      setFiltered(response.data);
    }
  };

  useEffect(() => {
    const all = teams;
    setFiltered(
      query
        ? all.filter((item) => {
            return item.teamName.toLowerCase().includes(query.toLowerCase());
          })
        : all
    );
  }, [query]);

  useEffect(() => {
    getTeams();
  }, []);

  const handleCreate = async (e) => {
    if (newTeamName === null) {
      setError("Team name cannot be empty");
      return;
    } else if (newTeamDescription === null) {
      setError("Team description cannot be empty");
      return;
    }

    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_API_URL}/team/registerOne`,
        {
          teamName: newTeamName,
          description: newTeamDescription,
        }
      );

      if (response.status === 201) {
        notification.message = `Successfully created team "${newTeamName}"`;
        notification.severity = "success";
        setOpenDialog(false);
        getTeams();
      }
    } catch (e) {
      if (e.response.status === 406) {
        setError(
          "There already exists a team with this name. Please choose another name."
        );
      }
    }

    setError(null);
    setNewTeamDescription(null);
    setNewTeamName(null);
    setNotification(notification);
  };

  return (
    <>
      {notification.message && (
        <CustomSnackbar
          notification={notification}
          setNotification={setNotification}
        />
      )}

      <Box>
        <Header
          title="Teams"
          setQuery={setQuery}
          placeholder="Search teams"
          setOpen={setOpenDialog}
          canAdd={user && user.role.permissions.siteAdmin_teams.add}
        />
        {teams && (
          <Stack spacing={1}>
            {filtered && filtered.length >= 1 ? (
              filtered.map((team) => {
                return (
                  <TeamCard key={team.id} team={team} getTeams={getTeams} />
                );
              })
            ) : teams ? (
              <EmptyState text="Your search didn't return anything. Try a different keyword." />
            ) : (
              <EmptyState text="There are no teams registered." />
            )}
          </Stack>
        )}
      </Box>

      {/* add new team dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add new team</DialogTitle>
        <DialogContent sx={{ width: 500 }}>
          <Box>
            {error && (
              <Alert sx={{ width: "100%" }} severity="error">
                {error}
              </Alert>
            )}
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography gutterBottom color="text.secondary">
              Team name
            </Typography>
            <TextField
              type="text"
              name="teamName"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              fullWidth
            />
          </Box>
          <Box>
            <Typography gutterBottom color="text.secondary">
              Description
            </Typography>
            <TextField
              type="text"
              name="description"
              multiline
              rows={10}
              value={newTeamDescription}
              onChange={(e) => setNewTeamDescription(e.target.value)}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
