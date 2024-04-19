import { useTheme } from "@emotion/react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SendTwoToneIcon from "@mui/icons-material/SendTwoTone";
import TreeItem, { treeItemClasses } from "@mui/lab/TreeItem";
import TreeView from "@mui/lab/TreeView";
import {
  Box,
  Button,
  Container,
  Divider,
  Skeleton,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { authContext } from "../App";
import axiosInstance from "../api";
import CustomSnackbar from "../components/alerts/CustomSnackbar";
import EmptyState from "../components/empty-state/EmptyState";
import NotFound from "../components/errors/NotFound";
import CourseHeader from "../components/header/CourseHeader";
import CourseMaterials from "../sections/admin/site-administration/courses/CourseMaterials";
import Comment from "../sections/courses/comment/Comment";

export default function CourseHome() {
  const [course, setCourse] = useState();
  const { courseId } = useParams();
  const { user } = useContext(authContext);
  const [courseUser, setCourseUser] = useState();
  const [courseTitle, setCourseTitle] = useState(null);
  const [courseMaterials, setCourseMaterials] = useState(null);
  const [comment, setComment] = useState(null);
  const [notification, setNotification] = useState({});
  const [activeTreeItem, setActiveTreeItem] = useState(null);
  const theme = useTheme();

  const handleTreeItemClick = (nodeId) => {
    setActiveTreeItem(nodeId);
  };

  const getCourse = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.REACT_APP_API_URL}/course/findOneById/${courseId}`
      );

      if (response.status === 200) {
        const thisCourse = response.data;
        if (thisCourse.courseUsers.length >= 1) {
          const thisUser = thisCourse.courseUsers.filter((item) => {
            return item.userId === user.id;
          });
          setCourseUser(thisUser);
        }
        setCourse(thisCourse);
        setCourseTitle(thisCourse.title);
      }
    } catch (e) {
      if (!e.response) {
        return (
          <EmptyState text="The server is not reachable please try again later." />
        );
      } else if (e.response.status === 404) {
        return <NotFound />;
      }
    }
  }, [courseId, user.id]);

  useEffect(() => {
    const getMaterials = async () => {
      try {
        const response = await axiosInstance.get(
          `${process.env.REACT_APP_API_URL}/coursematerial/findManyByCourseTitle/${courseTitle}`
        );

        if (response.status === 200) {
          console.log(response.data);
          setCourseMaterials(response.data);
        }
      } catch (e) {
        if (!e.response) {
          return (
            <EmptyState text="The server is not reachable please try again later." />
          );
        } else if (e.response.status === 404) {
          return <NotFound />;
        }
      }
    };

    getCourse();
    if (courseTitle) {
      getMaterials();
    }
  }, [courseTitle, getCourse]);

  const addComment = async () => {
    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_API_URL}/comments/register/${
          course && course.title
        }/${user && user.email}`,
        {
          body: comment,
        }
      );

      if (response.status === 201) {
        getCourse();
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

  const renderFileTree = (files) => {
    return files.map((file) => {
      return (
        <TreeItem
          key={file.id}
          nodeId={file.id}
          label={file.originalname.split(".")[0]}
          sx={{ my: 1 }}
          onClick={() => handleTreeItemClick(file.id)}
        />
      );
    });
  };

  const renderMaterialTree = (material) => (
    <TreeItem
      sx={{
        [`& .${treeItemClasses.group}`]: {
          borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
        },
      }}
      key={material.id}
      nodeId={material.id}
      label={material.title}>
      {renderFileTree(material.files)}
    </TreeItem>
  );

  return (
    <>
      {notification.message && (
        <CustomSnackbar
          notification={notification}
          setNotification={setNotification}
        />
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            sm: "1fr",
            md: "1fr 3fr",
            lg: "1fr 3fr 1fr",
          },
          gap: 2,
        }}>
        {/* Sidebar tree view */}
        <Box
          sx={{
            borderRight: "1px solid",
            borderRightColor: "action.selected",
            height: "100vh",
            py: 2,
            position: "sticky",
            top: 0,
            [theme.breakpoints.down("md")]: {
              display: "none",
            },
          }}>
          <Typography color="text.secondary" variant="h6" sx={{ px: 1.5 }}>
            Course Materials
          </Typography>
          {courseMaterials && (
            <TreeView
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
              sx={{ mt: 2 }}>
              {/* Map through courseMaterials and create TreeItem for each */}
              {courseMaterials.map((material) => renderMaterialTree(material))}
            </TreeView>
          )}
        </Box>

        <Container
          maxWidth="md"
          sx={{ display: "flex", flexDirection: "column", gap: 4, py: 2 }}>
          <CourseHeader
            title={course && course.title}
            started={courseUser && courseUser.length >= 1}
          />
          <Box sx={{ display: "flex", flexDirection: "row", gap: 4 }}>
            <Box>
              <Typography color="text.secondary" variant="subtitle2">
                Category
              </Typography>
              {course ? (
                <Typography
                  variant="h4"
                  sx={{
                    [theme.breakpoints.down("lg")]: {
                      fontSize: "3vw",
                    },
                    [theme.breakpoints.down("sm")]: {
                      fontSize: "4vw",
                    },
                  }}>
                  {course.category.categoryName}
                </Typography>
              ) : (
                <Skeleton />
              )}
            </Box>
          </Box>
          <Box>
            <Typography color="text.secondary" variant="subtitle2">
              Description
            </Typography>
            {course ? (
              <Typography variant="body2">{course.description}</Typography>
            ) : (
              <Skeleton />
            )}
          </Box>

          <Box>
            <Typography color="text.secondary" variant="subtitle2">
              Course Materials
            </Typography>
            {course && (
              <CourseMaterials
                title={course.title}
                activeTreeItem={activeTreeItem}
              />
            )}
          </Box>

          {/* comments */}
          {user && user.role.permissions.comment.view && (
            <Box>
              <Typography color="text.secondary" variant="subtitle2">
                Comments
              </Typography>
              {course && course.comments.length >= 1 ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {course.comments.map((comment) => {
                    return (
                      <Comment
                        comment={comment}
                        own={comment.userId === localStorage.getItem("id")}
                      />
                    );
                  })}
                </Box>
              ) : (
                <>
                  <EmptyState text="There are no comments. Be the first one to write a comment" />
                  <Divider sx={{ my: 2 }} />
                </>
              )}
              {user && user.role.permissions.comment.add && (
                <Box
                  sx={{
                    my: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    alignItems: "end",
                  }}>
                  <TextField
                    value={comment}
                    multiline
                    fullWidth
                    rows={5}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your comment here..."
                  />
                  <Button
                    size="large"
                    variant="contained"
                    disabled={comment === null || comment === ""}
                    endIcon={<SendTwoToneIcon />}
                    onClick={addComment}>
                    Post
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
}
