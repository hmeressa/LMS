import { useTheme } from "@emotion/react";
import { Box, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axiosInstance from "../api";
import EmptyState from "../components/empty-state/EmptyState";
import NetworkError from "../components/errors/NetworkError";
import Header from "../components/header/MainPagesHeader";
import Announcements from "../sections/courses/announcements/Announcements";
import CourseCard from "../sections/courses/course-card/CourseCard";
import Search from "../sections/courses/sort-and-filter/Search";
import Sort from "../sections/courses/sort-and-filter/Sort";
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
} from "../sections/courses/styled-accordion/StyledAccordion";

export default function AllCourses() {
  const [, setExpanded] = useState(false);
  const [categories, setCategories] = useState();
  const [query, setQuery] = useState();
  const [filtered, setFiltered] = useState();
  const [error, setError] = useState();
  const [sortOrder, setSortOrder] = useState("asc");
  const theme = useTheme();

  const handleChange = (panelId) => (e, isExpanded) => {
    setExpanded(isExpanded ? panelId : false);
  };

  const getCategories = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.REACT_APP_API_URL}/category/findAll`
      );

      if (response.status === 200) {
        let sorted;
        // display only categories with at least one course
        const result = response.data.filter((item) => {
          return item.course.length >= 1;
        });

        if (result.length >= 1) {
          sorted = result.sort((a, b) => {
            return sortOrder === "asc"
              ? a.categoryName.toLowerCase() > b.categoryName.toLowerCase()
              : a.categoryName.toLowerCase() < b.categoryName.toLowerCase();
          });
        }

        setCategories(sorted);
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
    getCategories();
  }, []);

  useEffect(() => {
    if (!categories) return;

    const filteredCategories = categories.filter((category) => {
      const matchingCourses = category.course.filter((course) =>
        course.title.toLowerCase().includes(query ? query.toLowerCase() : "")
      );

      return (
        !query ||
        category.categoryName.toLowerCase().includes(query.toLowerCase()) ||
        matchingCourses.length > 0
      );
    });

    const sortedCategoriesWithSortedCourses = filteredCategories.map(
      (category) => {
        const sortedCourses = [...category.course].sort((a, b) => {
          return (
            a.title.toLowerCase().localeCompare(b.title.toLowerCase()) *
            (sortOrder === "asc" ? 1 : -1)
          );
        });

        return {
          ...category,
          course: sortedCourses,
        };
      }
    );

    const sortedFilteredCategories = [
      ...sortedCategoriesWithSortedCourses,
    ].sort((a, b) => {
      return (
        a.categoryName
          .toLowerCase()
          .localeCompare(b.categoryName.toLowerCase()) *
        (sortOrder === "asc" ? 1 : -1)
      );
    });

    setFiltered(sortedFilteredCategories);
  }, [query, categories, sortOrder]);

  if (error) {
    return <EmptyState text={error} />;
  }

  return (
    <>
      <Header title="All Courses" />

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
            filtered.map((category) => {
              return (
                <StyledAccordion
                  expanded={true}
                  onChange={handleChange(category.categoryName)}
                  props={{ key: category.id }}>
                  <StyledAccordionSummary>
                    <Typography>{category.categoryName}</Typography>
                  </StyledAccordionSummary>
                  <StyledAccordionDetails>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr", // One column for extra-small screens
                          sm: "1fr 1fr", // Two columns for small screens and up
                          xl: "1fr 1fr 1fr", // Four columns for extra large screens and up
                        },
                        gap: 2,
                      }}>
                      {category.course.map((course) => {
                        return <CourseCard course={course} />;
                      })}
                    </Box>
                  </StyledAccordionDetails>
                </StyledAccordion>
              );
            })
          ) : categories ? (
            <EmptyState text="Your search didn't return anything. Try a different keyword." />
          ) : (
            <EmptyState text="There are no available courses" />
          )}
        </Box>

        <Box>
          <Search
            enabled={categories && categories.length >= 1}
            setQuery={setQuery}
          />
          <Box
            sx={{
              [theme.breakpoints.down("md")]: {
                display: "none",
              },
            }}>
            <Divider />
            <Sort
              enabled={categories && categories.length >= 1}
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
