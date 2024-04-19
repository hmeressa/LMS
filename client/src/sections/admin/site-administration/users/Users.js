import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import {
  Avatar,
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { authContext } from "../../../../App";
import axiosInstance from "../../../../api";
import EmptyState from "../../../../components/empty-state/EmptyState";
import Header from "../Header";
import AddNewUserDialog from "./AddNewUser";

export default function Users() {
  const [users, setUsers] = useState();
  const [filtered, setFiltered] = useState();
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const [query, setQuery] = useState();
  const { user } = useContext(authContext);

  const getUsers = async () => {
    const response = await axiosInstance.post(
      `${process.env.REACT_APP_API_URL}/user/findAll`
    );

    if (response.status === 200) {
      setUsers(response.data);
      setFiltered(response.data);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    const all = users;
    setFiltered(
      query
        ? all.filter((user) => {
            const userName = `${user.firstName} ${user.lastName}`;
            const email = user.email;
            return (
              userName.toLowerCase().includes(query.toLowerCase()) ||
              email.toLowerCase().includes(query.toLowerCase())
            );
          })
        : all
    );
  }, [query]);

  const handleOk = async () => {
    try {
      const response = await axiosInstance.delete(
        `${process.env.REACT_APP_API_URL}/user/deleteAdminById/${currentUser.id}`
      );

      if (response.status === 200) {
        getUsers();
        setOpenDelete(false);
      }
    } catch (error) {}
  };

  return (
    <>
      <Box>
        <Header
          title="Users"
          setQuery={setQuery}
          placeholder="Search users by name or email"
          setOpen={setOpenAdd}
          canAdd={user && user.role.permissions.siteAdmin_users.add}
        />
        {users && (
          <TableContainer component={Card}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Team</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered && filtered.length >= 1 ? (
                  filtered.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell>
                        <Avatar />
                      </TableCell>
                      <TableCell>{row.firstName}</TableCell>
                      <TableCell>{row.lastName}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.position}</TableCell>
                      <TableCell>{row.team.teamName}</TableCell>
                      <TableCell>{row.role.roleName}</TableCell>
                      <TableCell>{row.phone}</TableCell>
                      <TableCell>{row.status}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                          }}
                        >
                          {user.role.permissions.siteAdmin_users.edit && (
                            <IconButton>
                              <EditTwoToneIcon fontSize="small" />
                            </IconButton>
                          )}
                          {user.role.permissions.siteAdmin_users.delete && (
                            <IconButton
                              onClick={() => {
                                setCurrentUser(row);
                                setOpenDelete(true);
                              }}
                            >
                              <DeleteTwoToneIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : users && users.length >= 1 ? (
                  <EmptyState text="Your search didn't return anything. Try a different keyword" />
                ) : (
                  <EmptyState text="There are no users to display." />
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* delete dialog */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>{`Are you sure you want to delete user ${
          currentUser && currentUser.firstName
        } ${currentUser && currentUser.lastName}? `}</DialogTitle>
        <DialogContent>
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

      {/* add dialog */}
      <AddNewUserDialog
        openAdd={openAdd}
        setOpenAdd={setOpenAdd}
        getUsers={getUsers}
      />
    </>
  );
}
