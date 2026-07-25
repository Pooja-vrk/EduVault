import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useEffect, useState } from "react";


/* =========================
   LAYOUT
========================= */

import Layout from "./components/layout/Layout";


/* =========================
   MAIN PAGES
========================= */

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Materials from "./pages/Materials";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import MaterialCategory from "./pages/MaterialCategory";
import MaterialViewer from "./pages/materials/MaterialViewer";


/* =========================
   MATERIAL CATEGORY PAGES
========================= */

import PPTMaterials from "./pages/materials/PPTMaterials";
import NotesMaterials from "./pages/materials/NotesMaterials";
import DocumentMaterials from "./pages/materials/DocumentMaterials";
import LabMaterials from "./pages/materials/LabMaterials";


/* =========================
   ADMIN PAGES
========================= */

import Admin from "./pages/Admin";
import Users from "./pages/Users";
import FeedbackAdmin from "./pages/FeedbackAdmin";

import AdminRoute from "./routes/AdminRoute";



function App() {


  const [isLoggedIn,setIsLoggedIn] =
  useState(
    !!localStorage.getItem("token")
  );



  /* =========================
     CHECK LOGIN STATUS
  ========================= */


  useEffect(()=>{


    const checkLogin=()=>{

      setIsLoggedIn(
        !!localStorage.getItem("token")
      );

    };


    window.addEventListener(
      "storage",
      checkLogin
    );


    return()=>{

      window.removeEventListener(
        "storage",
        checkLogin
      );

    };


  },[]);




  return (

    <Routes>


      {/* =========================
          PUBLIC LANDING PAGE
      ========================= */}

{/* =========================
    ROOT ROUTE
========================= */}

<Route
  path="/"
  element={
    isLoggedIn ? (
      JSON.parse(localStorage.getItem("user"))?.role === "admin" ? (
        <Navigate to="/admin" replace />
      ) : (
        <Navigate to="/dashboard" replace />
      )
    ) : (
      <Navigate to="/login" replace />
    )
  }
/>


      {/* =========================
          LOGIN PAGE
      ========================= */}


      <Route
        path="/login"
        element={

          !isLoggedIn ?

          (

            <Login
              setIsLoggedIn={
                setIsLoggedIn
              }
            />

          )

          :

          (

            <Navigate
              to="/dashboard"
              replace
            />

          )

        }
      />




      {/* =========================
          REGISTER PAGE
      ========================= */}


      <Route
        path="/register"
        element={

          !isLoggedIn ?

          (

            <Register
              setIsLoggedIn={
                setIsLoggedIn
              }
            />

          )

          :

          (

            <Navigate
              to="/dashboard"
              replace
            />

          )

        }
      />






      {/* =========================
          PROTECTED ROUTES
      ========================= */}


      <Route

        element={

          isLoggedIn ?

          (

            <Layout/>

          )

          :

          (

            <Navigate
              to="/login"
              replace
            />

          )

        }

      >



        {/* DASHBOARD */}

        <Route
          path="/dashboard"
          element={
            <Dashboard/>
          }
        />



        {/* HOME */}

        <Route
          path="/home"
          element={
            <Home/>
          }
        />



        {/* MATERIALS */}

        <Route
          path="/materials"
          element={
            <Materials/>
          }
        />



        <Route
          path="/materials/:type"
          element={
            <MaterialCategory/>
          }
        />




        {/* MATERIAL CATEGORY */}


        <Route
          path="/materials/ppts"
          element={
            <PPTMaterials/>
          }
        />



        <Route
          path="/materials/notes"
          element={
            <NotesMaterials/>
          }
        />



        <Route
          path="/materials/documents"
          element={
            <DocumentMaterials/>
          }
        />



        <Route
          path="/materials/lab-manuals"
          element={
            <LabMaterials/>
          }
        />




        {/* VIEWER */}


        <Route
          path="/material-viewer/:id"
          element={
            <MaterialViewer/>
          }
        />




        {/* ABOUT */}

        <Route
          path="/about"
          element={
            <About/>
          }
        />



        {/* CONTACT */}

        <Route
          path="/contact"
          element={
            <Contact/>
          }
        />



        {/* PROFILE */}

        <Route
          path="/profile"
          element={
            <Profile/>
          }
        />



        {/* SETTINGS */}

        <Route
          path="/settings"
          element={
            <Settings/>
          }
        />





        {/* =========================
             ADMIN ROUTES
        ========================= */}



        <Route
          path="/admin"
          element={

            <AdminRoute>

              <Admin/>

            </AdminRoute>

          }
        />



        <Route
          path="/users"
          element={

            <AdminRoute>

              <Users/>

            </AdminRoute>

          }
        />



        <Route
          path="/feedback-admin"
          element={

            <AdminRoute>

              <FeedbackAdmin/>

            </AdminRoute>

          }
        />



      </Route>





      {/* =========================
          INVALID ROUTE
      ========================= */}


      <Route

        path="*"

        element={

          <Navigate
            to="/"
            replace
          />

        }

      />



    </Routes>

  );

}


export default App;