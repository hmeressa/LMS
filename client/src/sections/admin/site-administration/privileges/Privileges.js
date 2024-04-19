import SaveTwoToneIcon from "@mui/icons-material/SaveTwoTone";
import {
  Box,
  Button,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { authContext } from "../../../../App";
import axiosInstance from "../../../../api";
import CustomSnackbar from "../../../../components/alerts/CustomSnackbar";
import EmptyState from "../../../../components/empty-state/EmptyState";
import Header from "../Header";

const Privilege = () => {
  const [privileges, setPrivileges] = useState([]);
  const [roles, setRoles] = useState([]);
  const [changed, setChanged] = useState({});
  const [notification, setNotification] = useState({});
  const [query, setQuery] = useState("");
  const { user } = useContext(authContext);
  const canEdit = user && user.role.permissions.siteAdmin_privileges.edit;

  const getPrivileges = async () => {
    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_API_URL}/role/findAll`
      );

      if (response.status === 200) {
        const initialPrivileges = response.data.reduce((acc, role) => {
          const rolePrivileges = role.privileges.map((privilege) => ({
            id: privilege.id,
            resourceName: privilege.resource.resourceName,
            description: privilege.resource.description,
            view: privilege.view,
            add: privilege.add,
            edit: privilege.edit,
            delete: privilege.delete,
          }));
          acc.push({
            id: role.id,
            roleName: role.roleName,
            description: role.description,
            privileges: rolePrivileges,
            changed: false,
          });
          return acc;
        }, []);
        setRoles(initialPrivileges);
        setPrivileges(initialPrivileges);
      }
    } catch (e) {}
  };

  useEffect(() => {
    getPrivileges();
  }, []);

  useEffect(() => {
    const all = roles;
    setPrivileges(
      query
        ? all.filter((role) => {
            return role.roleName.toLowerCase().includes(query.toLowerCase());
          })
        : all
    );
  }, [query]);

  const handleSave = async (roleId) => {
    try {
      const rolePrivilege = privileges
        .find((privilege) => privilege.id === roleId)
        .privileges.map((privilege) => ({
          id: privilege.id,
          view: privilege.view,
          add: privilege.add,
          edit: privilege.edit,
          delete: privilege.delete,
        }));
      const response = await axiosInstance.put(
        `${process.env.REACT_APP_API_URL}/role/updatePrivileges`,
        rolePrivilege
      );
      if (response.status === 200) {
        notification.message = "Changes saved successfully.";
        notification.severity = "success";
        const newChanged = { ...changed };
        newChanged[roleId] = false;
        setChanged(newChanged);
      }
    } catch (e) {
      notification.message = "Failed to save changes. Please try again";
      notification.severity = "error";
    }

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

      <Header
        title="Privileges"
        setQuery={setQuery}
        placeholder="Search roles by role name"
      />
      {privileges.length >= 1 ? (
        privileges.map((roleData) => (
          <Card key={roleData.id} sx={{ marginBottom: 5 }}>
            <Box>
              <Typography variant="h6" sx={{ p: 2, textAlign: "center" }}>
                {roleData.roleName}
              </Typography>
              <Typography
                variant="body"
                sx={{ p: 2, textAlign: "center" }}
                color="text.secondary">
                {roleData.description}
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Resource</TableCell>
                    <TableCell>View</TableCell>
                    <TableCell>Add</TableCell>
                    <TableCell>Edit</TableCell>
                    <TableCell>Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {roleData.privileges.map((privilege) => (
                    <TableRow key={`${roleData.id}-${privilege.id}`}>
                      <TableCell>
                        <Typography>{privilege.resourceName}</Typography>
                        <Typography color="text.secondary">
                          {privilege.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          disabled={!canEdit}
                          checked={privilege.view}
                          onChange={() => {
                            const newPrivileges = [...roleData.privileges];
                            const index = newPrivileges.findIndex(
                              (p) => p.id === privilege.id
                            );
                            newPrivileges[index] = {
                              ...newPrivileges[index],
                              view: !privilege.view,
                            };
                            const newRoleData = {
                              ...roleData,
                              privileges: newPrivileges,
                              changed: true,
                            };
                            const newPrivilegesState = [...privileges];
                            const index2 = newPrivilegesState.findIndex(
                              (p) => p.id === roleData.id
                            );
                            newPrivilegesState[index2] = newRoleData;
                            setPrivileges(newPrivilegesState);
                            const newChanged = { ...changed };
                            newChanged[roleData.id] = true;
                            setChanged(newChanged);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          disabled={!canEdit}
                          checked={privilege.add}
                          onChange={() => {
                            const newPrivileges = [...roleData.privileges];
                            const index = newPrivileges.findIndex(
                              (p) => p.id === privilege.id
                            );
                            newPrivileges[index] = {
                              ...newPrivileges[index],
                              add: !privilege.add,
                            };
                            const newRoleData = {
                              ...roleData,
                              privileges: newPrivileges,
                              changed: true,
                            };
                            const newPrivilegesState = [...privileges];
                            const index2 = newPrivilegesState.findIndex(
                              (p) => p.id === roleData.id
                            );
                            newPrivilegesState[index2] = newRoleData;
                            setPrivileges(newPrivilegesState);
                            const newChanged = { ...changed };
                            newChanged[roleData.id] = true;
                            setChanged(newChanged);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          disabled={!canEdit}
                          checked={privilege.edit}
                          onChange={() => {
                            const newPrivileges = [...roleData.privileges];
                            const index = newPrivileges.findIndex(
                              (p) => p.id === privilege.id
                            );
                            newPrivileges[index] = {
                              ...newPrivileges[index],
                              edit: !privilege.edit,
                            };
                            const newRoleData = {
                              ...roleData,
                              privileges: newPrivileges,
                              changed: true,
                            };
                            const newPrivilegesState = [...privileges];
                            const index2 = newPrivilegesState.findIndex(
                              (p) => p.id === roleData.id
                            );
                            newPrivilegesState[index2] = newRoleData;
                            setPrivileges(newPrivilegesState);
                            const newChanged = { ...changed };
                            newChanged[roleData.id] = true;
                            setChanged(newChanged);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          disabled={!canEdit}
                          checked={privilege.delete}
                          onChange={() => {
                            const newPrivileges = [...roleData.privileges];
                            const index = newPrivileges.findIndex(
                              (p) => p.id === privilege.id
                            );
                            newPrivileges[index] = {
                              ...newPrivileges[index],
                              delete: !privilege.delete,
                            };
                            const newRoleData = {
                              ...roleData,
                              privileges: newPrivileges,
                              changed: true,
                            };
                            const newPrivilegesState = [...privileges];
                            const index2 = newPrivilegesState.findIndex(
                              (p) => p.id === roleData.id
                            );
                            newPrivilegesState[index2] = newRoleData;
                            setPrivileges(newPrivilegesState);
                            const newChanged = { ...changed };
                            newChanged[roleData.id] = true;
                            setChanged(newChanged);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                p: 2,
              }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveTwoToneIcon />}
                onClick={() => handleSave(roleData.id)}
                disabled={!changed[roleData.id] || !canEdit}>
                Save Changes
              </Button>
            </Box>
          </Card>
        ))
      ) : (
        <EmptyState text="Add some roles first to see their privileges" />
      )}
    </>
  );
};

export default Privilege;
