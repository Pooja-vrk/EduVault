import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import {
  FaUserGraduate,
  FaGraduationCap,
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaShieldAlt,
  FaCheckCircle,
  FaBookOpen,
  FaLaptopCode,
  FaDatabase,
} from "react-icons/fa";

import "./Register.css";

const API_URL = "http://localhost:5000";

export default function Register({ setIsLoggedIn }) {

  const navigate = useNavigate();

  const cardRef = useRef(null);

  // ============================
  // STATES
  // ============================

  const [name, setName] = useState("");

  const [studentId, setStudentId] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword,
    setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [passwordStrength,
    setPasswordStrength] =
    useState(0);

  const [mouse, setMouse] =
    useState({
      x:0,
      y:0
    });

  // ============================
  // CURSOR GLOW
  // ============================

  useEffect(()=>{

    const move=(e)=>{

      setMouse({

        x:e.clientX,

        y:e.clientY

      });

    };

    window.addEventListener("mousemove",move);

    return()=>{

      window.removeEventListener(
        "mousemove",
        move
      );

    };

  },[]);

  // ============================
  // PASSWORD STRENGTH
  // ============================

  useEffect(()=>{

    let strength=0;

    if(password.length>=6)
      strength++;

    if(/[A-Z]/.test(password))
      strength++;

    if(/[0-9]/.test(password))
      strength++;

    if(/[^A-Za-z0-9]/.test(password))
      strength++;

    setPasswordStrength(strength);

  },[password]);

  // ============================
  // CARD 3D EFFECT
  // ============================

  const handleCardMove=(e)=>{

    if(!cardRef.current)
      return;

    const rect=
      cardRef.current
      .getBoundingClientRect();

    const x=e.clientX-rect.left;

    const y=e.clientY-rect.top;

    const rotateX=
      -(y-rect.height/2)/18;

    const rotateY=
      (x-rect.width/2)/18;

    cardRef.current.style.transform=
    `
      perspective(1200px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(1.02)
    `;

  };

  const resetCard=()=>{

    if(!cardRef.current)
      return;

    cardRef.current.style.transform=
    `
      perspective(1200px)
      rotateX(0deg)
      rotateY(0deg)
      scale(1)
    `;

  };

  // ============================
  // REGISTER
  // ============================

  const handleRegister = async(e)=>{

    e.preventDefault();

    const cleanName=name.trim();

    const cleanStudentId =
     studentId.trim().toUpperCase();

    if (
     !cleanName ||
     !cleanStudentId ||
     !password ||
     !confirmPassword
    ){

      toast.error(
        "Please fill all fields."
      );

      return;

    }

    if(password.length<6){

      toast.error(
        "Password should be at least 6 characters."
      );

      return;

    }

    if(password!==confirmPassword){

      toast.error(
        "Passwords do not match."
      );

      return;

    }

    try{

      setLoading(true);

      const res=
      await axios.post(

        `${API_URL}/api/auth/register`,

        {

        name: cleanName,
        studentId: cleanStudentId,
        password,


        },

        {

          headers:{
            "Content-Type":
            "application/json"
          }

        }

      );

      const token=
        res.data.token;

      const user=
        res.data.user;

      localStorage.setItem(
        "token",
        token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      localStorage.setItem(
        "role",
        user.role
      );

      if(typeof setIsLoggedIn==="function"){

        setIsLoggedIn(true);

      }

      toast.success(
        "Registration Successful 🎉"
      );

      if(user.role==="admin"){

        navigate("/admin");

      }else{

        navigate("/dashboard");

      }

    }
    catch(err){

      toast.error(

        err.response?.data?.message ||

        "Registration failed."

      );

    }
    finally{

      setLoading(false);

    }

  };
    return (
    <div className="register-page">

      {/* Cursor Glow */}
      <div
        className="cursor-glow"
        style={{
          left: mouse.x,
          top: mouse.y,
        }}
      />

      {/* Aurora Background */}
      <div className="aurora"></div>

      {/* Glass Blobs */}
      <div className="glass-blob blob1"></div>
      <div className="glass-blob blob2"></div>
      <div className="glass-blob blob3"></div>
      <div className="glass-blob blob4"></div>

      {/* Background Circles */}
      <div className="bg-circle circle1"></div>
      <div className="bg-circle circle2"></div>
      <div className="bg-circle circle3"></div>

      {/* Sparkles */}
      <div className="sparkles">
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i}></span>
        ))}
      </div>

      {/* Floating Icons */}
      <div className="floating-icons">
        <FaGraduationCap />
        <FaBookOpen />
        <FaLaptopCode />
        <FaDatabase />
      </div>

      <div className="register-overlay">

        <div
          ref={cardRef}
          className="register-card"
          onMouseMove={handleCardMove}
          onMouseLeave={resetCard}
        >

          <div className="logo-circle">
            <FaGraduationCap />
          </div>

          <h1 className="main-title">
            Create Account
          </h1>

          <p className="subtitle">
            Join EduVault and start your learning journey.
          </p>

          <form onSubmit={handleRegister}>
                        <div className="input-group">

              <label>
                Full Name
              </label>

              <div className="input-box">

                <FaUser />

                <input
                  type="text"
                  placeholder="Enter Full Name"
                  value={name}
                  onChange={(e)=>setName(e.target.value)}
                  disabled={loading}
                />

              </div>

            </div>
                        <div className="input-group">

              <label>
               Student ID
              </label>

              <div className="input-box">

                <FaUserGraduate />

                <input
                  type="text"
                  placeholder="Enter Student ID"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value.toUpperCase())}
                  required
                />
              </div>

            </div>
                        <div className="input-group">

              <label>
                Password
              </label>

              <div className="password-box">

                <FaLock />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Create Password"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  disabled={loading}
                />

                <button
                  type="button"
                  className="eye-icon"
                  onClick={()=>
                    setShowPassword(!showPassword)
                  }
                >

                  {showPassword
                    ? <FaEyeSlash/>
                    : <FaEye/>}

                </button>

              </div>

            </div>
                        {/* Confirm Password */}

            <div className="input-group">

              <label>
                Confirm Password
              </label>

              <div className="password-box">

                <FaLock />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  disabled={loading}
                  onChange={(e)=>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  className="eye-icon"
                  onClick={()=>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >

                  {
                    showConfirmPassword
                    ? <FaEyeSlash/>
                    : <FaEye/>
                  }

                </button>

              </div>

            </div>
                        {/* Password Strength */}

            <div className="strength-container">

              <div className="strength-bar">

                <div
                  className={`strength-fill strength-${passwordStrength}`}
                ></div>

              </div>

              <span>

                {
                  passwordStrength===0 &&
                  "Very Weak"
                }

                {
                  passwordStrength===1 &&
                  "Weak"
                }

                {
                  passwordStrength===2 &&
                  "Medium"
                }

                {
                  passwordStrength===3 &&
                  "Strong"
                }

                {
                  passwordStrength===4 &&
                  "Very Strong"
                }

              </span>

            </div>
                        <button
              type="submit"
              className="register-btn"
              disabled={loading}
            >

              {
                loading
                ?

                <div className="spinner"></div>

                :

                <>
                  <FaCheckCircle />

                  <span>
                    Create Account
                  </span>
                </>
              }

            </button>
                        <div className="bottom-links">

              <span>
                Already have an account?
              </span>

              <Link to="/login">

                Login

              </Link>

            </div>
                        <div className="register-security">

              <FaShieldAlt />

              <span>

                Your information is encrypted and securely stored.

              </span>

            </div>
            </form>

        </div>

      </div>

    </div>

  );

}