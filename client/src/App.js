import { createContext, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import axiosInstance from "./api";
import HomeLayout from "./layouts/home/HomeLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AllCourses from "./pages/AllCourses";
import CourseHome from "./pages/CourseHome";
import Dashboard from "./pages/Dashboard";
import MyCourses from "./pages/MyCourses";
import Settings from "./pages/Settings";
import SiteAdministration from "./sections/admin/site-administration/SiteAdministration";
import AnnouncementsAdmin from "./sections/admin/site-administration/announcements/AnnouncementsAdmin";
import Categories from "./sections/admin/site-administration/categories/Categories";
import AddNewCourse from "./sections/admin/site-administration/courses/AddNewCourse";
import Courses from "./sections/admin/site-administration/courses/Courses";
import Privileges from "./sections/admin/site-administration/privileges/Privileges";
import Roles from "./sections/admin/site-administration/roles/Roles";
import Teams from "./sections/admin/site-administration/teams/Teams";
import AddNewUser from "./sections/admin/site-administration/users/AddNewUser";
import Users from "./sections/admin/site-administration/users/Users";
import Login from "./sections/auth/LoginPage";
import ForgetPassword from "./sections/auth/forget-password/ForgetPassword";
import CustomThemeProvider from "./theme/themeProvider";

export const authContext = createContext({
  user: {},
  setUser: (info) => {},
  getUserData: () => {},
  isLoggedIn: false,
  setIsLoggedIn: (auth) => {},
});

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [id, setId] = useState(localStorage.getItem("id"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");

    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

    if (token && id) {
      getUserData(id);
    }
  }, []);

  const getUserData = async (id) => {
    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_API_URL}/auth/getme`
      );
      if (response.status === 200) {
        setUser(response.data);
      }
    } catch (e) {
      if (e.code === "ERR_NETWORK") {
      } else if (e.response.status === 404) {
        localStorage.removeItem("id");
        localStorage.removeItem("token");
      } else if (e.request) {
      }
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    getUserData(localStorage.getItem("id"));
  };

  return (
    <authContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, getUserData, user, setUser }}>
      <CustomThemeProvider>
        <BrowserRouter>
          <Routes>
            {!isLoggedIn && (
              <>
                <Route path="/*" element={<Navigate to="/" />} />
                <Route path="/" element={<Login handleLogin={handleLogin} />} />
                <Route path="/forget-password" element={<ForgetPassword />} />
              </>
            )}

            {isLoggedIn && (
              <>
                <Route path="/" element={<HomeLayout />}>
                  {user && user.role.permissions.allCourses.view && (
                    <Route index element={<Navigate to="my-courses" />} />
                  )}

                  {/* can the user view myCourses section */}
                  {user && user.role.permissions.allCourses.view && (
                    <Route path="/my-courses" element={<MyCourses />} />
                  )}

                  {/* can the user view allCourses section */}
                  {user && user.role.permissions.allCourses.view && (
                    <Route path="/all-courses" element={<AllCourses />} />
                  )}

                  {/* can the user view dashboard section */}
                  {user && user.role.permissions.dashboard.view && (
                    <Route path="/dashboard" element={<Dashboard />} />
                  )}

                  {/* can the user view dashboard section */}
                  {user && user.role.permissions.siteAdmin_dashboard.view && (
                    <Route
                      path="/admin-dashboard"
                      element={<AdminDashboard />}
                    />
                  )}

                  {/* can the user view settings section */}
                  {user && user.role.permissions.settings.view && (
                    <Route path="/settings" element={<Settings />} />
                  )}

                  {/* if the user cannot view all the elements inside 'site-administration'
                  remove the site-administration route itself */}
                  {user &&
                    (user.role.permissions.siteAdmin_users.view ||
                      user.role.permissions.siteAdmin_courses.view ||
                      user.role.permissions.siteAdmin_teams.view ||
                      user.role.permissions.siteAdmin_privileges.view ||
                      user.role.permissions.siteAdmin_announcements.view ||
                      user.role.permissions.siteAdmin_categories.view ||
                      user.role.permissions.siteAdmin_roles.view) && (
                      <Route
                        path="/site-administration"
                        element={<SiteAdministration />}>
                        {/* can the user view siteAdmin_users */}
                        {user.role.permissions.siteAdmin_users.view && (
                          <Route
                            path="/site-administration/users"
                            element={<Users />}
                          />
                        )}

                        {/* can the user add another user */}
                        {user.role.permissions.siteAdmin_users.add && (
                          <Route
                            path="/site-administration/users/new"
                            element={<AddNewUser />}
                          />
                        )}

                        {/* can the user view siteAdmin_courses */}
                        {user.role.permissions.siteAdmin_courses.view && (
                          <Route
                            path="/site-administration/courses"
                            element={<Courses />}
                          />
                        )}

                        {/* can the user add a course */}
                        {user.role.permissions.siteAdmin_courses.add && (
                          <Route
                            path="/site-administration/courses/new"
                            element={<AddNewCourse />}
                          />
                        )}

                        {/* can the user view siteAdmin_teams */}
                        {user.role.permissions.siteAdmin_teams.view && (
                          <Route
                            path="/site-administration/teams"
                            element={<Teams />}
                          />
                        )}

                        {/* can the user view siteAdmin_roles */}
                        {user.role.permissions.siteAdmin_roles.view && (
                          <Route
                            path="/site-administration/roles"
                            element={<Roles />}
                          />
                        )}

                        {/* can the user view siteAdmin_privileges */}
                        {user.role.permissions.siteAdmin_privileges.view && (
                          <Route
                            path="/site-administration/privileges"
                            element={<Privileges />}
                          />
                        )}

                        {/* can the user view siteAdmin_announcements */}
                        {user.role.permissions.siteAdmin_announcements.view && (
                          <Route
                            path="/site-administration/announcements"
                            element={<AnnouncementsAdmin />}
                          />
                        )}

                        {/* can the user view siteAdmin_categories */}
                        {user.role.permissions.siteAdmin_categories.view && (
                          <Route
                            path="/site-administration/categories"
                            element={<Categories />}
                          />
                        )}
                      </Route>
                    )}
                </Route>
                {user && user.role.permissions.allCourses.view && (
                  <Route path="/courses/:courseId" element={<CourseHome />} />
                )}
              </>
            )}
          </Routes>
        </BrowserRouter>
      </CustomThemeProvider>
    </authContext.Provider>
  );
}
