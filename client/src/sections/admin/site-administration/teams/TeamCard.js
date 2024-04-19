import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { authContext } from "../../../../App";
import axiosInstance from "../../../../api";
import CustomSnackbar from "../../../../components/alerts/CustomSnackbar";

export default function TeamCard({ team, getTeams }) {
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [notification, setNotification] = useState({});
  const [newTeamName, setNewTeamName] = useState();
  const [newTeamDescription, setNewTeamDescription] = useState();
  const [teamMembers, setTeamMembers] = useState();
  const { user } = useContext(authContext);

  const handleOk = async () => {
    try {
      const response = await axiosInstance.delete(
        `${process.env.REACT_APP_API_URL}/team/deleteOneById/${team.id}`
      );

      if (response.status === 200) {
        notification.message = "The team is deleted successfully.";
        notification.severity = "success";
        getTeams();
      }
    } catch (e) {
      notification.message = "Error while deleting team. Please try again.";
      notification.severity = "error";
    }

    setOpenDelete(false);
    setNotification(notification);
  };

  const handleSave = async (e) => {
    try {
      const response = await axiosInstance.put(
        `${process.env.REACT_APP_API_URL}/team/updateOne/${team.id}`,
        {
          teamName: newTeamName || team.teamName,
          description: newTeamDescription || team.description,
        }
      );

      if (response.status === 200) {
        notification.message = "The team is edited successfully.";
        notification.severity = "success";
        getTeams();
      }
    } catch (e) {
      notification.message = "Error while saving changes. Please try again.";
      notification.severity = "error";
    }

    setOpenEdit(false);
  };

  useEffect(() => {
    const getTeamMembers = async () => {
      try {
        const response = await axiosInstance.post(
          `${process.env.REACT_APP_API_URL}/user/findAll`
        );

        if (response.status === 201) {
          const filtered = response.data.filter(
            (user) => user.team.teamName === team.teamName
          );
          setTeamMembers(filtered);
        }
      } catch (e) {}
    };

    getTeamMembers();
  }, []);

  return (
    <>
      {notification.message && (
        <CustomSnackbar
          notification={notification}
          setNotification={setNotification}
        />
      )}

      <Card>
        <CardContent>
          <Typography variant="h6">{team.teamName}</Typography>
          <Typography>{team.description}</Typography>
          <Box
            sx={{
              mt: 2,
              display: "flex",
              flexDirection: "row",
            }}
          >
            {teamMembers &&
              teamMembers.slice(0, 10).map((member) => {
                return (
                  <Tooltip
                    key={member.id}
                    title={`${member.firstName} ${member.lastName}`}
                  >
                    <Avatar
                      src={`${process.env.REACT_APP_API_URL}/avatar/getAvatar/${member.email}`}
                      alt={`${member.firstName}'s avatar`}
                      sx={{
                        width: 24,
                        height: 24,
                        mr: -1,
                      }}
                    />
                  </Tooltip>
                );
              })}
            {teamMembers && teamMembers.length > 10 ? (
              <Box sx={{ ml: 2 }}>{`+${teamMembers.length - 10}`}</Box>
            ) : (
              <></>
            )}
          </Box>
        </CardContent>

        {team.teamName !== "All" && (
          <CardActions disableSpacing>
            {user && user.role.permissions.siteAdmin_teams.edit && (
              <IconButton onClick={() => setOpenEdit(true)}>
                <EditTwoToneIcon />
              </IconButton>
            )}
            {user && user.role.permissions.siteAdmin_teams.delete && (
              <IconButton onClick={() => setOpenDelete(true)}>
                <DeleteTwoToneIcon />
              </IconButton>
            )}
          </CardActions>
        )}
      </Card>

      {/* delete dialog */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>{`Are you sure you want to delete team ${team.teamName}? `}</DialogTitle>
        <DialogContent>
          {teamMembers && teamMembers.length >= 1 && (
            <DialogContentText>{`This action will also delete ${teamMembers.length} members of the ${team.teamName} team.`}</DialogContentText>
          )}
          <DialogContentText>This action can't be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleOk}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* edit dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogContent sx={{ width: 500 }}>
          <Box>
            <Typography gutterBottom color="text.secondary">
              Team name
            </Typography>
            <TextField
              name="teamName"
              defaultValue={team.teamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              fullWidth
            />
          </Box>
          <Box>
            <Typography gutterBottom color="text.secondary">
              Description
            </Typography>
            <TextField
              name="description"
              multiline
              rows={10}
              defaultValue={team.description}
              onChange={(e) => setNewTeamDescription(e.target.value)}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
