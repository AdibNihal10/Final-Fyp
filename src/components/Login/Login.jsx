// import React, { useState } from "react";
// import {
//   Grid,
//   Paper,
//   Avatar,
//   TextField,
//   Button,
//   Typography,
//   Link,
// } from "@mui/material";
// import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

// const paperStyle = {
//   padding: 20,
//   height: "70vh",
//   width: 300,
//   margin: "20px auto",
// };
// const avatarStyle = { backgroundColor: "#1bbd7e" };
// const btnStyle = { margin: "8px 0" };

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Use fetch API instead of axios
//       const response = await fetch("http://localhost:5000/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email,
//           password,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to login");
//       }

//       const data = await response.json();
//       alert(`Welcome, ${data.admin.name}!`);
//       // Redirect to admin dashboard
//       window.location.href = "/admin-dashboard"; // Change this as per your routes
//     } catch (error) {
//       alert("Login failed: " + error.message);
//     }
//   };

//   return (
//     <Grid>
//       <Paper elevation={10} style={paperStyle}>
//         <Grid align="center">
//           <Avatar style={avatarStyle}>
//             <LockOutlinedIcon />
//           </Avatar>
//           <h2>Admin Login</h2>
//         </Grid>
//         <form onSubmit={handleSubmit}>
//           <TextField
//             label="Email"
//             placeholder="Enter email"
//             fullWidth
//             required
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <TextField
//             label="Password"
//             placeholder="Enter password"
//             type="password"
//             fullWidth
//             required
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           <Button
//             type="submit"
//             color="primary"
//             variant="contained"
//             style={btnStyle}
//             fullWidth
//           >
//             Login
//           </Button>
//         </form>
//         <Typography>
//           <Link href="#">Forgot password?</Link>
//         </Typography>
//       </Paper>
//     </Grid>
//   );
// };

// export default Login;
