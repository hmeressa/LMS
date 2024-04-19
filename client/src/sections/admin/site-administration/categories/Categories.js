import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import {
  AccordionActions,
  Alert,
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { authContext } from "../../../../App";
import axiosInstance from "../../../../api";
import CustomSnackbar from "../../../../components/alerts/CustomSnackbar";
import EmptyState from "../../../../components/empty-state/EmptyState";
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
} from "../../../courses/styled-accordion/StyledAccordion";
import Header from "../Header";

export default function Categories() {
  const [categories, setCategories] = useState(null);
  const [filtered, setFiltered] = useState();
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [categoryName, setCategoryName] = useState();
  const [categoryDescription, setCategoryDescription] = useState();
  const [changedName, setChangedName] = useState();
  const [changedDescription, setChangedDescription] = useState();
  const [currentCategory, setCurrentCategory] = useState();
  const [query, setQuery] = useState();
  const { user } = useContext(authContext);
  const [notification, setNotification] = useState({});

  const handleChange = (panelId) => (e, isExpanded) => {
    setExpanded(isExpanded ? panelId : false);
  };

  const getCategories = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.REACT_APP_API_URL}/category/findAll`
      );

      if (response.status === 200) {
        const sorted = response.data.sort(
          (a, b) => a.categoryName.toLowerCase() > b.categoryName.toLowerCase()
        );
        setCategories(sorted);
        setFiltered(sorted);
      }
    } catch (e) {
      if (e.code === "ERR_NETWORK" || !e.response) {
        return (
          <EmptyState text="Network error. Check your internet connection and try again." />
        );
      } else {
        <EmptyState text="Cannot get categories right now." />;
      }
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    const all = categories;
    setFiltered(
      query
        ? all.filter((category) => {
            return category.categoryName
              .toLowerCase()
              .includes(query.toLowerCase());
          })
        : all
    );
  }, [query]);

  const handleCreate = async () => {
    if (categoryName === null) {
      setError("Category name cannot be empty");
      return;
    } else if (categoryDescription === null) {
      setError("Category description cannot be empty");
      return;
    }

    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_API_URL}/category/registerOne`,
        {
          categoryName: categoryName,
          description: categoryDescription,
        }
      );

      if (response.status === 201) {
        setOpenDialog(false);
        getCategories();
        notification.message = "Category created successfully";
        notification.severity = "success";
      }
    } catch (e) {
      if (e.response.status === 406) {
        setError(
          "There already exists a category with this name. Please choose another name."
        );
      }
    }

    setError(null);
    setCategoryDescription(null);
    setCategoryName(null);
    setNotification(notification);
  };

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(
        `${process.env.REACT_APP_API_URL}/category/deleteOneById/${currentCategory.id}`
      );

      if (response.status === 200) {
        setOpenDelete(false);
        getCategories();
        notification.message = "Category deleted successfully";
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

  const handleUpdate = async () => {
    try {
      const response = await axiosInstance.put(
        `${process.env.REACT_APP_API_URL}/category/updateOne/${currentCategory.id}`,
        {
          categoryName: changedName || currentCategory.categoryName,
          description:
            changedDescription || currentCategory.categoryDescription,
        }
      );

      if (response.status === 200) {
        setOpenEditDialog(false);
        getCategories();
        notification.message = "Category updated successfully";
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
          title="Categories"
          setQuery={setQuery}
          placeholder="Search categories"
          setOpen={setOpenDialog}
          canAdd={user && user.role.permissions.siteAdmin_categories.add}
        />
        {categories && (
          <Stack spacing={1}>
            {filtered && filtered.length >= 1 ? (
              filtered.map((category) => {
                return (
                  <StyledAccordion
                    key={category.id}
                    expanded={expanded === category.categoryName}
                    onChange={handleChange(category.categoryName)}>
                    <StyledAccordionSummary>
                      <Box>
                        <Typography>{category.categoryName}</Typography>
                        <Typography color="text.secondary">
                          {category.description}
                        </Typography>
                      </Box>
                    </StyledAccordionSummary>
                    <StyledAccordionDetails>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          flexDirection: "column",
                        }}>
                        {category.course.length >= 1 ? (
                          category.course.map((course) => {
                            return (
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  py: 1,
                                  px: 2,
                                }}
                                component={Card}>
                                <Typography>{course.title}</Typography>
                              </Box>
                            );
                          })
                        ) : (
                          <EmptyState text="There are no courses under this category" />
                        )}
                      </Box>
                    </StyledAccordionDetails>
                    <AccordionActions>
                      <Box>
                        {user &&
                          user.role.permissions.siteAdmin_categories.edit && (
                            <IconButton
                              onClick={() => {
                                setCurrentCategory(category);
                                setOpenEditDialog(true);
                              }}>
                              <EditTwoToneIcon />
                            </IconButton>
                          )}
                        {user &&
                          user.role.permissions.siteAdmin_categories.delete && (
                            <IconButton
                              onClick={() => {
                                setCurrentCategory(category);
                                setOpenDelete(true);
                              }}>
                              <DeleteTwoToneIcon />
                            </IconButton>
                          )}
                      </Box>
                    </AccordionActions>
                  </StyledAccordion>
                );
              })
            ) : categories ? (
              <EmptyState text="Your search didn't return anything. Try a different keyword." />
            ) : (
              <EmptyState text="There are no categories registered." />
            )}
          </Stack>
        )}
      </Box>

      {/* add new category dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add new category</DialogTitle>
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
              Category Name
            </Typography>
            <TextField
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              fullWidth
            />
          </Box>
          <Box>
            <Typography gutterBottom color="text.secondary">
              Description
            </Typography>
            <TextField
              type="text"
              multiline
              rows={10}
              value={categoryDescription}
              onChange={(e) => setCategoryDescription(e.target.value)}
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

      {/* edit dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>{`Edit category ${
          currentCategory && currentCategory.categoryName
        }`}</DialogTitle>
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
              Category Name
            </Typography>
            <TextField
              type="text"
              defaultValue={currentCategory && currentCategory.categoryName}
              onChange={(e) => setChangedName(e.target.value)}
              fullWidth
            />
          </Box>
          <Box>
            <Typography gutterBottom color="text.secondary">
              Description
            </Typography>
            <TextField
              type="text"
              multiline
              rows={10}
              defaultValue={currentCategory && currentCategory.description}
              onChange={(e) => setChangedDescription(e.target.value)}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* delete dialog */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>{`Are you sure you want to delete category ${
          currentCategory && currentCategory.categoryName
        }? `}</DialogTitle>
        <DialogContent>
          {currentCategory && currentCategory.course.length >= 1 && (
            <DialogContentText>{`This action will also delete ${
              currentCategory && currentCategory.course.length
            } courses under this category.`}</DialogContentText>
          )}
          <DialogContentText>This action can't be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
            autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
