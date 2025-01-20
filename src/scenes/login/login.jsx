// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const LoginPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError(""); // Clear any previous error messages

//     try {
//       // Use full backend URL for the API call
//       const response = await fetch("http://localhost:5000/api/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }), // Send login credentials
//       });

//       const data = await response.json();
//       if (response.ok) {
//         // Save login state (if needed)
//         localStorage.setItem("isAdmin", true);
//         localStorage.setItem("userName", data.user.name);

//         // Navigate to the admin dashboard
//         navigate("/admin/dashboard");
//       } else {
//         // Show error message from backend
//         setError(data.message);
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Something went wrong. Please try again.");
//     }
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         marginTop: "50px",
//       }}
//     >
//       <h1>Admin Login</h1>
//       <form
//         onSubmit={handleLogin}
//         style={{ width: "300px", display: "flex", flexDirection: "column" }}
//       >
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           style={{ marginBottom: "10px", padding: "10px" }}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           style={{ marginBottom: "10px", padding: "10px" }}
//         />
//         <button
//           type="submit"
//           style={{ padding: "10px", backgroundColor: "blue", color: "white" }}
//         >
//           Login
//         </button>
//       </form>
//       {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
//     </div>
//   );
// };

// export default LoginPage;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous error messages

    try {
      // Use full backend URL for the API call
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }), // Send login credentials
      });

      const data = await response.json();
      if (response.ok) {
        // Save login state and update React state
        localStorage.setItem("isAdmin", "true");
        localStorage.setItem("userName", data.user.name);

        setIsLoggedIn(true); // Update React state
        navigate("/team"); // Redirect to the admin dashboard
      } else {
        // Show error message from backend
        setError(data.message);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "50px",
      }}
    >
      <h1>Admin Login</h1>
      <form
        onSubmit={handleLogin}
        style={{ width: "300px", display: "flex", flexDirection: "column" }}
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: "10px", padding: "10px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: "10px", padding: "10px" }}
        />
        <button
          type="submit"
          style={{
            padding: "10px",
            backgroundColor: "blue",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </form>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
};

export default LoginPage;
