import { useTheme } from "@emotion/react";
import { Box, Divider } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { authContext } from "../App";
import axiosInstance from "../api";
import EmptyState from "../components/empty-state/EmptyState";
import NetworkError from "../components/errors/NetworkError";
import Header from "../components/header/MainPagesHeader";
import Announcements from "../sections/courses/announcements/Announcements";
import MyCourseCard from "../sections/courses/course-card/MyCourseCard";
import Filter from "../sections/courses/sort-and-filter/Filter";
import Search from "../sections/courses/sort-and-filter/Search";
import Sort from "../sections/courses/sort-and-filter/Sort";

export default function MyCourses() {
  const [enrollments, setEnrollments] = useState();
  const [sortOrder, setSortOrder] = useState("asc");
  const [query, setQuery] = useState();
  const [filterProps, setFilterProps] = useState([true, true]);
  const [filtered, setFiltered] = useState();
  const [error, setError] = useState();
  const { user } = useContext(authContext);
  const theme = useTheme();

  const getEnrollments = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.REACT_APP_API_URL}/courseEnrollment/findManyByEmail/${
          user && user.email
        }`
      );

      if (response.status === 200) {
        let sorted;
        if (response.data.length >= 1) {
          sorted = response.data.sort((a, b) => {
            return sortOrder === "asc"
              ? a.course.title.toLowerCase() > b.course.title.toLowerCase()
              : a.course.title.toLowerCase() < b.course.title.toLowerCase();
          });
        }

        setEnrollments(sorted);
        setFiltered(sorted);
      }
    } catch (e) {
      if (e.code === "ERR_NETWORK" || !e.response) {
        return <NetworkError />;
      }
      setError("Unable to get categories right now please try again");
    }
  };

  useEffect(() => {
    getEnrollments();
  }, []);

  useEffect(() => {
    if (!enrollments) return;
    const all = enrollments;

    const sub =
      // if both checkboxes are checked display all enrollments
      filterProps[0] && filterProps[1]
        ? all
        : // or check each checkbox one by one
        filterProps[0] // In progress checkbox
        ? all.filter((enrollment) => enrollment.status === "PROGRESS")
        : filterProps[1] // Done checkbox
        ? all.filter((enrollment) => enrollment.status === "COMPLETED")
        : // if you get here that means both checkboxes are false and
          // and we need at least one of them to be true
          all;

    sub.sort((a, b) => {
      if (a.course.title.toLowerCase() > b.course.title.toLowerCase()) {
        return sortOrder === "asc" ? -1 : 1;
      }

      if (a.course.title.toLowerCase() < b.course.title.toLowerCase()) {
        return sortOrder === "asc" ? 1 : -1;
      }

      return 0;
    });

    setFiltered(
      query
        ? sub.filter((enrollment) => {
            return enrollment.course.title
              .toLowerCase()
              .includes(query.toLowerCase());
          })
        : sub
    );
  }, [query, filterProps, sortOrder]);

  if (error) {
    return <EmptyState text={error} />;
  }

  return (
    <>
      <Header title="My Courses" />
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 4,
          [theme.breakpoints.down("md")]: { flexDirection: "column-reverse" },
        }}>
        <Box sx={{ flexGrow: 1 }}>
          {filtered && filtered.length >= 1 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr", // One column for extra-small screens
                  sm: "1fr 1fr", // Two columns for small screens and up
                  xl: "1fr 1fr 1fr", // Four columns for extra large screens and up
                },
                height: "fit-content",
                gap: 2,
              }}>
              {filtered.map((enrollment) => {
                return (
                  <MyCourseCard key={enrollment.id} enrollment={enrollment} />
                );
              })}
            </Box>
          ) : enrollments ? (
            <EmptyState text="Your search result doesn't return anything. Try another keyword or adjust your filter criteria." />
          ) : (
            <EmptyState text="You haven't enrolled to a course yet. Go to All Courses section and find one that interests you." />
          )}
        </Box>

        <Box>
          <Search
            enabled={enrollments && enrollments.length >= 1}
            setQuery={setQuery}
          />
          <Box
            sx={{
              [theme.breakpoints.down("md")]: {
                display: "none",
              },
            }}>
            <Filter
              enabled={enrollments && enrollments.length >= 1}
              filterProps={filterProps}
              change={setFilterProps}
            />
            <Divider />
            <Sort
              enabled={enrollments && enrollments.length >= 1}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
            <Divider />
            <Announcements />
          </Box>
        </Box>
      </Box>
    </>
  );
}
