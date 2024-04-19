import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import {
  Alert,
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
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import intlFormat from "date-fns/intlFormat";
import { useContext, useEffect, useState } from "react";
import { authContext } from "../../../../App";
import axiosInstance from "../../../../api";
import CustomSnackbar from "../../../../components/alerts/CustomSnackbar";
import EmptyState from "../../../../components/empty-state/EmptyState";
import Header from "../Header";

export default function AnnouncementsAdmin() {
  const [announcements, setAnnouncements] = useState();
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState();
  const [title, setTitle] = useState(null);
  const [body, setBody] = useState(null);
  const [target, setTarget] = useState(null);
  const [targetType, setTargetType] = useState("public");
  const [query, setQuery] = useState();
  const [teams, setTeams] = useState();
  const [users, setUsers] = useState();
  const { user } = useContext(authContext);
  const [notification, setNotification] = useState({});
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);

  const handleDeleteConfirmation = (announcementId) => {
    setDeleteConfirmationId(announcementId);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmationId(null);
  };

  const handleDeleteConfirmed = async () => {
    if (deleteConfirmationId) {
      await handleDelete(deleteConfirmationId);
      setDeleteConfirmationId(null);
    }
  };

  const getTeams = async () => {
    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_API_URL}/team/findAll`
      );

      if (response.status === 200) {
        setTeams(response.data);
      }
    } catch (e) {
      if (e.code === "ERR_NETWORK" || !e.response) {
        notification.message = "Network error. Please try again later";
        notification.severity = "error";
      } else {
        notification.message = e.response.data.message;
        notification.severity = "error";
      }
    }

    setNotification(notification);
  };

  const getUsers = async () => {
    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_API_URL}/user/findAll`
      );

      if (response.status === 200) {
        setUsers(response.data);
      }
    } catch (e) {
      if (e.code === "ERR_NETWORK" || !e.response) {
        notification.message = "Network error. Please try again later";
        notification.severity = "error";
      } else {
        notification.message = e.response.data.message;
        notification.severity = "error";
      }
    }

    setNotification(notification);
  };

  const getAnnouncements = async () => {
    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_API_URL}/announcement/findManyByEmail/${
          user && user.email
        }`
      );

      if (response.status === 200) {
        setAnnouncements(response.data);
      }
    } catch (e) {
      if (e.response.status === 404) {
        setError("Couldn't find announcements");
      }
    }

    setError(null);
  };

  const handleCreate = async () => {
    if (title === null) {
      setError("Please provide a title");
      return;
    } else if (body === null) {
      setError("Please provide a body");
      return;
    }

    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_API_URL}/announcement/registerOne/${
          user && user.email
        }`,
        {
          title: title,
          body: body,
          target: targetType === "public" ? "public" : target,
        }
      );

      if (response.status === 201) {
        getAnnouncements();
        setOpenDialog(false);

        notification.message = "Announcements successfully created";
        notification.severity = "success";
      }
    } catch (e) {
      if (e.code === "ERR_NETWORK" || !e.response) {
        notification.message =
          "Network error. Check your internet connection and try again.";
        notification.severity = "error";
      } else {
        notification.message = e.response.data.message;
        notification.severity = "error";
      }
    }

    setNotification(notification);
  };

  useEffect(() => {
    getAnnouncements();
    getTeams();
    getUsers();
  }, []);

  const handleDelete = async (announcementId) => {
    try {
      const response = await axiosInstance.delete(
        `${process.env.REACT_APP_API_URL}/announcement/deleteOneById/${announcementId}`
      );

      if (response.status === 200) {
        getAnnouncements();

        setNotification({
          message: "Announcement successfully deleted",
          severity: "success",
        });
      }
    } catch (error) {
      if (error.code === "ERR_NETWORK" || !error.response) {
        setNotification({
          message:
            "Network error. Check your internet connection and try again.",
          severity: "error",
        });
      } else {
        setNotification({
          message: error.response.data.message,
          severity: "error",
        });
      }
    }
  };

  return (
    <>
      {notification.message && (
        <CustomSnackbar
          notification={notification}
          setNotification={setNotification}
        />
      )}

      <Header
        title="Announcements"
        setQuery={setQuery}
        placeholder="Search announcements by date, title, target or author"
        setOpen={setOpenDialog}
        canAdd={user && user.role.permissions.siteAdmin_announcements.add}
      />
      <Box>
        {announcements && announcements.length ? (
          announcements.map((announcement) => {
            return (
              <Card sx={{ my: 1 }} key={announcement.id}>
                <CardContent>
                  <Typography fontSize="small" color="text.secondary">
                    {`${announcement.user.firstName} ${
                      announcement.user.lastName
                    } - ${intlFormat(Date.parse(announcement.createdAt), {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    })}`}
                  </Typography>
                  <Typography>{announcement.title}</Typography>
                  <Typography paragraph>{announcement.body}</Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 2,
                    }}>
                    <Typography fontSize="small" color="text.secondary">
                      Target: {`${announcement.target}`}
                    </Typography>
                    <Typography fontSize="small" color="text.secondary">
                      Read Count: {`${announcement.readCounter}`}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions disableSpacing>
                  {user &&
                    user.role.permissions.siteAdmin_announcements.edit && (
                      <IconButton>
                        <EditTwoToneIcon />
                      </IconButton>
                    )}
                  {user &&
                    user.role.permissions.siteAdmin_announcements.delete && (
                      <>
                        <IconButton
                          onClick={() =>
                            handleDeleteConfirmation(announcement.id)
                          }>
                          <DeleteTwoToneIcon />
                        </IconButton>
                        <Dialog
                          open={deleteConfirmationId === announcement.id}
                          onClose={handleDeleteCancel}>
                          <DialogTitle>
                            Are you sure you want to delete this announcement?
                          </DialogTitle>
                          <DialogContent>
                            <DialogContentText>
                              This action can't be undone.
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={handleDeleteCancel}>Cancel</Button>
                            <Button
                              autoFocus
                              onClick={handleDeleteConfirmed}
                              variant="contained"
                              color="error">
                              Delete
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </>
                    )}
                </CardActions>
              </Card>
            );
          })
        ) : (
          <EmptyState text="You haven't add any announcements" />
        )}
      </Box>

      {/* add new announcement dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add new announcement</DialogTitle>
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
              Title
            </Typography>
            <TextField
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography gutterBottom color="text.secondary">
              Body
            </Typography>
            <TextField
              type="text"
              multiline
              rows={10}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              fullWidth
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography gutterBottom color="text.secondary">
              Target
            </Typography>
            <Select
              fullWidth
              defaultValue="public"
              onChange={(e) => setTargetType(e.target.value)}>
              <MenuItem value="public">Public</MenuItem>
              <MenuItem value="team">Specific team</MenuItem>
              <MenuItem value="user">Specific user</MenuItem>
            </Select>
          </Box>

          {targetType === "team" && (
            <Box>
              <Typography gutterBottom color="text.secondary">
                Teams
              </Typography>
              <Select fullWidth onChange={(e) => setTarget(e.target.value)}>
                {teams &&
                  teams.map((team) => {
                    return (
                      <MenuItem key={team.id} value={team.teamName}>
                        {team.teamName}
                      </MenuItem>
                    );
                  })}
              </Select>
            </Box>
          )}

          {targetType === "user" && (
            <Box>
              <Typography gutterBottom color="text.secondary">
                Users
              </Typography>
              <Select fullWidth onChange={(e) => setTarget(e.target.value)}>
                {users &&
                  users.map((user) => {
                    return (
                      <MenuItem
                        key={user.id}
                        value={
                          user.email
                        }>{`${user.firstName} ${user.lastName}`}</MenuItem>
                    );
                  })}
              </Select>
            </Box>
          )}
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
