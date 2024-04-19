import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import {
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
  Typography
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { authContext } from "../../../../App";
import axiosInstance from "../../../../api";
import CustomSnackbar from "../../../../components/alerts/CustomSnackbar";

export default function RoleCard({ role, getRoles }) {
  const [newRoleName, setNewRoleName] = useState();
  const [newRoleDescription, setNewRoleDescription] = useState();
  const [roles, setRoles] = useState();
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const { user } = useContext(authContext);
  const [notification, setNotification] = useState({});

  const handleOk = async () => {
    try {
      const response = await axiosInstance.delete(
        `${process.env.REACT_APP_API_URL}/role/deleteOneById/${role.id}`
      );

      if (response.status === 200) {
        getRoles();
        setOpenDelete(false);
        notification.message = "The role is deleted successfully.";
        notification.severity = "success";
      }
    } catch (e) {
      notification.message = "Error while deleting team. Please try again";
      notification.severity = "error";
    }

    setNotification(notification);
  };

  const handleSave = async () => {
    try {
      const response = await axiosInstance.put(
        `${process.env.REACT_APP_API_URL}/role/updateOne/${role.id}`,
        {
          roleName: newRoleName || role.roleName,
          description: newRoleDescription || role.description,
        }
      );

      if (response.status === 200) {
        setOpenEdit(false);
        getRoles();
        notification.message = "Role updated successfully.";
        notification.severity = "success";
      }
    } catch (e) {
      notification.message = "Error while updating a role.";
      notification.severity = "error";
    }

    setNotification(notification);
  };

  useEffect(() => {
    const getRoles = async () => {
      try {
        const response = await axiosInstance.post(
          `${process.env.REACT_APP_API_URL}/role/findAll`
        );

        if (response.status === 200) {
          const filtered = response.data.filter(
            (role) => role.role.roleName === role.roleName
          );
          setRoles(filtered);
        }
      } catch (e) {}
    };

    getRoles();
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
          <Typography variant="h6">{role.roleName}</Typography>
          <Typography>{role.description}</Typography>
        </CardContent>
        {role.roleName !== "All" && (
          <CardActions disableSpacing>
            {user && user.role.permissions.siteAdmin_roles.edit && (
              <IconButton onClick={() => setOpenEdit(true)}>
                <EditTwoToneIcon />
              </IconButton>
            )}
            {user && user.role.permissions.siteAdmin_roles.delete && (
              <IconButton onClick={() => setOpenDelete(true)}>
                <DeleteTwoToneIcon />
              </IconButton>
            )}
          </CardActions>
        )}
      </Card>

      {/* delete dialog */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>{`Are you sure you want to delete role ${role.roleName}? `}</DialogTitle>
        <DialogContent>
          {roles && roles.length >= 1 && (
            <DialogContentText>{`${roles.length} roles associated with this role will also be deleted.`}</DialogContentText>
          )}
          <DialogContentText>This action can't be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleOk}
            autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* edit dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogContent sx={{ width: 500 }}>
          <Box>
            <Typography gutterBottom color="text.secondary">
              role name
            </Typography>
            <TextField
              name="roleName"
              defaultValue={role.roleName}
              onChange={(e) => setNewRoleName(e.target.value)}
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
              defaultValue={role.description}
              onChange={(e) => setNewRoleDescription(e.target.value)}
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
