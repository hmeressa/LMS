import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import {
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
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { authContext } from "../../../../App";
import axiosInstance from "../../../../api";
import CustomSnackbar from "../../../../components/alerts/CustomSnackbar";
import EmptyState from "../../../../components/empty-state/EmptyState";
import Header from "../Header";

export default function Courses() {
  const [courses, setCourses] = useState();
  const [filtered, setFiltered] = useState();
  const [currentCourse, setCurrentCourse] = useState();
  const [openDelete, setOpenDelete] = useState(false);
  const [query, setQuery] = useState();
  const { user } = useContext(authContext);
  const [notification, setNotification] = useState({});

  const getCourses = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.REACT_APP_API_URL}/course/findAll`
      );

      if (response.status === 200) {
        setCourses(response.data);
        setFiltered(response.data);
      }
    } catch (e) {}
  };

  useEffect(() => {
    getCourses();
  }, []);

  useEffect(() => {
    const all = courses;
    setFiltered(
      query
        ? all.filter((course) => {
            return course.title.toLowerCase().includes(query.toLowerCase());
          })
        : all
    );
  }, [query]);

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(
        `${process.env.REACT_APP_API_URL}/course/DeleteByTitle/${currentCourse.title}`
      );

      if (response.status === 200) {
        getCourses();
        setOpenDelete(false);
        notification.message = "Course deleted successfully";
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
          title="Courses"
          setQuery={setQuery}
          placeholder="Search course by title"
          to="/site-administration/courses/new"
          canAdd={
            user &&
            user.role.permissions.siteAdmin_courses.add &&
            user.role.permissions.allCourses.add
          }
        />
        {courses && (
          <TableContainer component={Card}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Course</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Users</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered && filtered.length >= 1 ? (
                  filtered.map((course) => (
                    <TableRow
                      key={course.id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell>
                        <Box>
                          <Typography>{course.title}</Typography>
                          <Typography color="text.secondary">
                            {course.description}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography>{course.category.categoryName}</Typography>
                      </TableCell>
                      <TableCell>{course.courseUsers.length}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                          }}
                        >
                          {user.role.permissions.siteAdmin_courses.edit && (
                            <IconButton>
                              <EditTwoToneIcon />
                            </IconButton>
                          )}
                          {user.role.permissions.siteAdmin_courses.delete && (
                            <IconButton
                              onClick={() => {
                                setCurrentCourse(course);
                                setOpenDelete(true);
                              }}
                            >
                              <DeleteTwoToneIcon />
                            </IconButton>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : courses && courses.length >= 1 ? (
                  <EmptyState text="Your search didn't return anything. Try a different keyword" />
                ) : (
                  <EmptyState text="There are no courses to display." />
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* delete dialog */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>{`Are you sure you want to delete course ${
          currentCourse && currentCourse.title
        }? `}</DialogTitle>
        <DialogContent>
          <DialogContentText>This action can't be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
