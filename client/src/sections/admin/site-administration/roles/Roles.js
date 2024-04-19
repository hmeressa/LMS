import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
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
import RoleCard from "./RoleCard";

export default function Roles() {
  const [newRoleName, setNewRoleName] = useState();
  const [newRoleDescription, setNewRoleDescription] = useState();
  const [roles, setRoles] = useState(null);
  const [filtered, setFiltered] = useState();
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState();
  const [error, setError] = useState();
  const [query, setQuery] = useState();
  const { user } = useContext(authContext);
  const [notification, setNotification] = useState({});

  const getRoles = async () => {
    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_API_URL}/role/findAll`
      );

      if (response.status === 200) {
        setRoles(response.data);
        setFiltered(response.data);
      }
    } catch (e) {}
  };

  useEffect(() => {
    getRoles();
  }, []);

  const handleCreate = async () => {
    if (newRoleName === null) {
      setError("role name cannot be empty");
      return;
    } else if (newRoleDescription === null) {
      setError("role description cannot be empty");
      return;
    }

    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_API_URL}/role/registerOne`,
        {
          roleName: newRoleName,
          description: newRoleDescription,
        }
      );

      if (response.status === 201) {
        notification.message = `Successfully created role "${newRoleName}"`;
        notification.severity = "success";
        setOpenDialog(false);
        getRoles();
      }
    } catch (e) {
      if (e.response.status === 406) {
        setError(
          "There already exists a role with this name. Please choose another name."
        );
        return;
      }
    }

    setError(null);
    setNewRoleDescription(null);
    setNewRoleName(null);
    setNotification(notification);
  };

  useEffect(() => {
    const all = roles;
    setFiltered(
      query
        ? all.filter((item) => {
            return item.roleName.toLowerCase().includes(query.toLowerCase());
          })
        : all
    );
  }, [query]);

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
          title="Roles"
          setQuery={setQuery}
          placeholder="Search roles"
          setOpen={setOpenDialog}
          canAdd={user && user.role.permissions.siteAdmin_roles.add}
        />
        <Typography variant="h4"></Typography>
        {roles && (
          <Stack spacing={1}>
            {filtered && filtered.length >= 1 ? (
              filtered.map((role) => {
                return (
                  <RoleCard key={role.id} role={role} getRoles={getRoles} />
                );
              })
            ) : roles ? (
              <EmptyState text="Your search didn't return anything. Try a different keyword" />
            ) : (
              <EmptyState text="There are no roles to display." />
            )}
          </Stack>
        )}
      </Box>

      {/* add new role */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add new role</DialogTitle>
        <DialogContent sx={{ width: 500 }}>
          <Box sx={{ mb: 2 }}>
            {error && (
              <Alert sx={{ width: "100%" }} severity="error">
                {error}
              </Alert>
            )}
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography gutterBottom color="text.secondary">
              Role Name
            </Typography>
            <TextField
              type="text"
              name="roleName"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
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
              value={newRoleDescription}
              onChange={(e) => setNewRoleDescription(e.target.value)}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* a little bottom notification to display the result of the update */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={message}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      />
    </>
  );
}
