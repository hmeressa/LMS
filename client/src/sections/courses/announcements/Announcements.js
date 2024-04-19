import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Tab,
  Typography,
} from "@mui/material";
import { intlFormat } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import { authContext } from "../../../App";
import axiosInstance from "../../../api";
import EmptyState from "../../../components/empty-state/EmptyState";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function Announcements() {
  const [open, setOpen] = useState(false);
  const [publicAnnouncements, setPublicAnnouncements] = useState([]);
  const [singleAnnouncement, setSingleAnnouncement] = useState("");
  const [teamAnnouncements, setTeamAnnouncements] = useState([]);
  const [individualAnnouncements, setIndividualAnnouncements] = useState([]);
  const { user } = useContext(authContext);
  const [value, setValue] = useState("public");

  // get public announcements
  const getPublicAnnouncements = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.REACT_APP_API_URL}/announcement/findAllPublicAnnouncements`
      );

      if (response.status === 200) {
        setPublicAnnouncements(response.data);
      }
    } catch (e) {}
  };

  // get single announcement details
  const getSingleAnnouncement = async (announcementId) => {
    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_API_URL}/announcement/findOneById/${announcementId}`
      );

      if (response.status === 200) {
        setSingleAnnouncement(response.data);
      }
    } catch (e) {}
  };

  // get single announcement details
  const getTeamNameByEmail = async (email) => {
    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_API_URL}/team/findTeamNameByEmail/${email}`
      );
      return response.data.teamName;
    } catch (err) {}
  };

  // get team announcements.
  const getTeamAnnouncements = async () => {
    try {
      const teamName = await getTeamNameByEmail(user && user.email);
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_API_URL}/announcement/findManyByTeamName/${teamName}`
      );
      if (response.status === 200) {
        setTeamAnnouncements(response.data);
      }
    } catch (e) {}
  };

  // get individual announcements.
  const getIndividualAnnouncements = async (email) => {
    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_API_URL}/announcement/findManyAnnouncementSentForMe/${email}`
      );

      if (response.status === 200) {
        setIndividualAnnouncements(response.data);
      }
    } catch (e) {}
  };

  useEffect(() => {
    getPublicAnnouncements();
    getTeamAnnouncements();
    getIndividualAnnouncements(user && user.email);
  }, []);

  const handleOpen = (announcementId) => {
    getSingleAnnouncement(announcementId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography color="action.active">Announcements</Typography>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={(e, newValue) => setValue(newValue)}>
            <Tab label="public" value="public" />
            <Tab label="Only Me" value="me" />
            <Tab label="My Team" value="team" />
          </TabList>
        </Box>
        <TabPanel sx={{ px: 0 }} value="public">
          {publicAnnouncements && publicAnnouncements.length >= 1 ? (
            publicAnnouncements.map((announcement) => {
              return (
                <Card
                  key={announcement.title}
                  onClick={() => handleOpen(announcement.id)}
                  sx={{
                    my: 1,
                    maxWidth: 280,
                    "&:hover": {
                      boxShadow: 4,
                      cursor: "pointer",
                    },
                  }}>
                  <CardHeader
                    subheader={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box>
                          <Typography fontSize="small" sx={{ lineHeight: 1 }}>
                            {`${announcement.user.firstName} ${
                              announcement.user.lastName
                            } - ${intlFormat(
                              Date.parse(announcement.createdAt),
                              {
                                year: "numeric",
                                month: "numeric",
                                day: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                              }
                            )}`}
                          </Typography>
                        </Box>
                      </Box>
                    }
                    sx={{ pb: 0, mb: 0 }}
                  />
                  <CardContent>
                    <Typography variant="subtitle2">
                      {announcement.title}
                    </Typography>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <EmptyState text="There are no public announcements." />
          )}
        </TabPanel>
        <TabPanel sx={{ px: 0 }} value="me">
          {individualAnnouncements && individualAnnouncements.length >= 1 ? (
            individualAnnouncements.map((announcement) => {
              return (
                <Card
                  key={announcement.title}
                  onClick={() => handleOpen(announcement.id)}
                  sx={{
                    my: 1,
                    maxWidth: 280,
                    "&:hover": {
                      boxShadow: 4,
                      cursor: "pointer",
                    },
                  }}>
                  <CardHeader
                    subheader={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box>
                          <Typography fontSize="small" sx={{ lineHeight: 1 }}>
                            {`${announcement.user.firstName} ${
                              announcement.user.lastName
                            } - ${intlFormat(
                              Date.parse(announcement.createdAt),
                              {
                                year: "numeric",
                                month: "numeric",
                                day: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                              }
                            )}`}
                          </Typography>
                        </Box>
                      </Box>
                    }
                    sx={{ pb: 0, mb: 0 }}
                  />
                  <CardContent>
                    <Typography variant="subtitle2">
                      {announcement.title}
                    </Typography>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <EmptyState text="No announcements for you." />
          )}
        </TabPanel>
        <TabPanel sx={{ px: 0 }} value="team">
          {teamAnnouncements && teamAnnouncements.length >= 1 ? (
            teamAnnouncements.map((announcement) => {
              return (
                <Card
                  key={announcement.title}
                  onClick={() => handleOpen(announcement.id)}
                  sx={{
                    my: 1,
                    maxWidth: 280,
                    "&:hover": {
                      boxShadow: 4,
                      cursor: "pointer",
                    },
                  }}>
                  <CardHeader
                    subheader={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box>
                          <Typography fontSize="small" sx={{ lineHeight: 1 }}>
                            {`${announcement.user.firstName} ${
                              announcement.user.lastName
                            } - ${intlFormat(
                              Date.parse(announcement.createdAt),
                              {
                                year: "numeric",
                                month: "numeric",
                                day: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                              }
                            )}`}
                          </Typography>
                        </Box>
                      </Box>
                    }
                    sx={{ pb: 0, mb: 0 }}
                  />
                  <CardContent>
                    <Typography variant="subtitle2">
                      {announcement.title}
                    </Typography>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <EmptyState text="No announcements for your team." />
          )}
        </TabPanel>
      </TabContext>

      <Dialog open={open} TransitionComponent={Transition} keepMounted>
        <DialogTitle>
          {singleAnnouncement.title}
          <Typography
            fontSize="small"
            color="text.secondary"
            sx={{ lineHeight: 1 }}>
            {singleAnnouncement &&
              singleAnnouncement.user &&
              `${singleAnnouncement.user.firstName} ${
                singleAnnouncement.user.lastName
              } - ${intlFormat(Date.parse(singleAnnouncement.createdAt), {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}`}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ width: 500 }}>
          <DialogContentText>{singleAnnouncement.body}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
