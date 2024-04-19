import { Card, CardContent, CardHeader, List, ListItem } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { authContext } from "../../App";
import axiosInstance from "../../api";
import EmptyState from "../../components/empty-state/EmptyState";

export default function RecentlyAccessed() {
  const [recentlyAccessedCourse, setRecentlyAccessedCourse] = useState(null);
  const { user } = useContext(authContext);

  useEffect(() => {
    try {
      const getRecentlyAccessed = async () => {
        const response = await axiosInstance.get(
          `${
            process.env.REACT_APP_API_URL
          }/recentlyAccessedCourse/findManyByEmail/${user && user.email}`
        );

        if (response.status === 200) {
          setRecentlyAccessedCourse(response.data);
        }
      };

      getRecentlyAccessed();
    } catch (e) {}
  }, []);

  return (
    <Card sx={{ overflow: "scroll", maxHeight: "100%" }}>
      <CardHeader title="Recently Accessed" />
      <CardContent>
        <List>
          {recentlyAccessedCourse && recentlyAccessedCourse.length >= 1 ? (
            recentlyAccessedCourse.map((accessed) => {
              return (
                <ListItem>
                  {accessed.course.title + " (" + accessed.counter + ") "} |{" "}
                  {accessed.updatedAt}
                </ListItem>
              );
            })
          ) : (
            <EmptyState text="There are no recently accessed courses" />
          )}
        </List>
      </CardContent>
    </Card>
  );
}
