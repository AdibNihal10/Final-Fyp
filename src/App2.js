// import { useState } from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import Topbar2 from "./scenes/global2/Topbar2";
// import Sidebar2 from "./scenes/global2/Sidebar2";
// import Dashboard from "./scenes/dashboard";
// import Team from "./scenes/team";
// import Conferences from "./scenes/stacked";
// import Agreements from "./scenes/networking";
// import Login from "./scenes/login/login";
// import { CssBaseline, ThemeProvider } from "@mui/material";
// import { ColorModeContext, useMode } from "./theme";

// function App2() {
//   const [theme, colorMode] = useMode();
//   const [isSidebar, setIsSidebar] = useState(true);

//   // Check if the user is logged in
//   const isLoggedIn = localStorage.getItem("isAdmin") === "true";

//   return (
//     <ColorModeContext.Provider value={colorMode}>
//       <ThemeProvider theme={theme}>
//         <CssBaseline />
//         {isLoggedIn ? (
//           <div className="app">
//             <Sidebar2 isSidebar={isSidebar} />
//             <main className="content">
//               <Topbar2 setIsSidebar={setIsSidebar} />
//               <Routes>
//                 <Route path="/team" element={<Team />} />
//                 <Route path="/conferences" element={<Conferences />} />
//                 <Route path="/networking" element={<Agreements />} />
//                 <Route path="/" element={<Navigate to="/team" />} />{" "}
//                 {/* Default route */}
//                 <Route path="*" element={<Navigate to="/team" />} />{" "}
//                 {/* Catch-all route */}
//               </Routes>
//             </main>
//           </div>
//         ) : (
//           <Routes>
//             <Route path="/login" element={<Login />} />
//             <Route path="*" element={<Navigate to="/login" />} />
//           </Routes>
//         )}
//       </ThemeProvider>
//     </ColorModeContext.Provider>
//   );
// }

// export default App2;
