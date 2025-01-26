// import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
// import { tokens } from "../../theme";
// import { mockTransactions } from "../../data/mockData";
// import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
// import EmailIcon from "@mui/icons-material/Email";
// import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
// import PersonAddIcon from "@mui/icons-material/PersonAdd";
// import TrafficIcon from "@mui/icons-material/Traffic";
// import Header from "../../components/Header";
// import LineChart from "../../components/LineChart";
// import GeographyChart from "../../components/GeographyChart";
// import BarChart from "../../components/BarChart";
// import StatBox from "../../components/StatBox";
// import ProgressCircle from "../../components/ProgressCircle";
// import Pie from "../pie";
// import Publications from "../publications";
// import scholarData from "../../data/scraped_scholar_data.json";
// import trainingData from "../../data/training.json";
// import Pie2 from "../pie2";
// const Dashboard = () => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   // Summing up H-Index, Citations, and Publications
//   const totalHIndex = scholarData.reduce(
//     (sum, scholar) => sum + scholar["H-INDEXED (SCOPUS)"],
//     0
//   );
//   const totalCitations = scholarData.reduce(
//     (sum, scholar) => sum + scholar["CITATIONS (SCOPUS)"],
//     0
//   );
//   const totalPublications = scholarData.reduce(
//     (sum, scholar) => sum + scholar["PUBLICATIONS"],
//     0
//   );
//   const totalGrants = scholarData.reduce(
//     (sum, scholar) => sum + scholar["GRANT(PI & MEMBERS)"],
//     0
//   );
//   const totalIPublications = scholarData.reduce(
//     (sum, scholar) => sum + scholar["INDEXED PUBLICATION"],
//     0
//   );
//   const sumProjectsByYear = (data) => {
//     return data.reduce((acc, item) => {
//       const year = item.Year;
//       acc[year] = (acc[year] || 0) + 1;
//       return acc;
//     }, {});
//   };
//   const totalProjectsByYear = sumProjectsByYear(trainingData);
//   return (
//     <Box m="20px">
//       {/* HEADER */}
//       <Box display="flex" justifyContent="space-between" alignItems="center">
//         <Header title="Faculty of Computing" subtitle="FC Scholar Dashboard" />
//       </Box>

//       {/* GRID & CHARTS */}
//       <Box
//         display="grid"
//         gridTemplateColumns="repeat(12, 1fr)"
//         gridAutoRows="140px"
//         gap="20px"
//       >
//         {/* ROW 1 */}
//         <Box
//           gridColumn="span 3"
//           backgroundColor={colors.primary[400]}
//           display="flex"
//           alignItems="center"
//           justifyContent="center"
//         >
//           <StatBox
//             title={totalIPublications.toLocaleString()}
//             subtitle={
//               <Typography
//                 sx={{
//                   color: colors.greenAccent[300], // Change subtitle color here
//                   fontSize: "16px",
//                   fontWeight: "bold",
//                   marginTop: "5px",
//                 }}
//               >
//                 Indexed Publications
//               </Typography>
//             }
//             progress=".542"
//             increase={
//               <Typography
//                 sx={{
//                   color: colors.greenAccent[100], // Change subtitle color here
//                   fontSize: "16px",
//                   fontWeight: "bold",
//                 }}
//               >
//                 54.2%
//               </Typography>
//             }
//             icon={
//               <Typography
//                 variant="caption"
//                 sx={{
//                   color: colors.blueAccent[600],
//                   fontSize: "18px",
//                   fontWeight: "bold",
//                   marginBottom: "5px",
//                 }}
//               >
//                 Faculty of Computing
//               </Typography>
//             }
//           />
//         </Box>
//         <Box
//           gridColumn="span 3"
//           backgroundColor={colors.primary[400]}
//           display="flex"
//           alignItems="center"
//           justifyContent="center"
//         >
//           <StatBox
//             title={totalPublications.toLocaleString()}
//             subtitle={
//               <Typography
//                 sx={{
//                   color: colors.greenAccent[300], // Change subtitle color here
//                   fontSize: "16px",
//                   fontWeight: "bold",
//                   marginTop: "5px",
//                 }}
//               >
//                 Publications
//               </Typography>
//             }
//             progress="0.75"
//             increase="+14%"
//             icon={
//               <Typography
//                 variant="caption"
//                 sx={{
//                   color: colors.redAccent[600],
//                   fontSize: "18px",
//                   fontWeight: "bold",
//                   marginBottom: "5px",
//                 }}
//               >
//                 Faculty of Computing
//               </Typography>
//             }
//           />
//         </Box>
//         <Box
//           gridColumn="span 3"
//           backgroundColor={colors.primary[400]}
//           display="flex"
//           alignItems="center"
//           justifyContent="center"
//         >
//           <StatBox
//             title={totalCitations.toLocaleString()}
//             subtitle={
//               <Typography
//                 sx={{
//                   color: colors.greenAccent[300], // Change subtitle color here
//                   fontSize: "16px",
//                   fontWeight: "bold",
//                   marginTop: "5px",
//                 }}
//               >
//                 Citations
//               </Typography>
//             }
//             progress="0.50"
//             increase="+21%"
//             icon={
//               <Typography
//                 variant="caption"
//                 sx={{
//                   color: colors.blueAccent[200],
//                   fontSize: "18px",
//                   fontWeight: "bold",
//                   marginBottom: "5px",
//                 }}
//               >
//                 Faculty of Computing
//               </Typography>
//             }
//           />
//         </Box>
//         <Box
//           gridColumn="span 3"
//           backgroundColor={colors.primary[400]}
//           display="flex"
//           alignItems="center"
//           justifyContent="center"
//         >
//           <StatBox
//             title={totalHIndex.toLocaleString()}
//             subtitle={
//               <Typography
//                 sx={{
//                   color: colors.greenAccent[300], // Change subtitle color here
//                   fontSize: "16px",
//                   fontWeight: "bold",
//                   marginTop: "5px",
//                 }}
//               >
//                 H-Index
//               </Typography>
//             }
//             progress="0.30"
//             increase="+5%"
//             icon={
//               <Typography
//                 variant="caption"
//                 sx={{
//                   color: colors.blueAccent[400],
//                   fontSize: "18px",
//                   fontWeight: "bold",
//                   marginBottom: "5px",
//                 }}
//               >
//                 Faculty of Computing
//               </Typography>
//             }
//           />
//         </Box>
//         <Box
//           gridColumn="span 3"
//           backgroundColor={colors.primary[400]}
//           display="flex"
//           alignItems="center"
//           justifyContent="center"
//         >
//           <StatBox
//             title={totalGrants.toLocaleString()}
//             subtitle="Grants(Pi & Members)"
//             progress=""
//             increase="+5%"
//             icon={
//               <Typography
//                 variant="caption"
//                 sx={{
//                   color: colors.blueAccent[400],
//                   fontSize: "18px",
//                   fontWeight: "bold",
//                   marginBottom: "5px",
//                 }}
//               >
//                 Faculty of Computing
//               </Typography>
//             }
//           />
//         </Box>
//         <Box
//           gridColumn="span 3"
//           backgroundColor={colors.primary[400]}
//           display="flex"
//           alignItems="center"
//           justifyContent="center"
//         >
//           <StatBox
//             title={totalProjectsByYear[2024] || 0}
//             subtitle="Trainings Conducted (2024)"
//             icon={
//               <Typography
//                 variant="caption"
//                 sx={{
//                   color: colors.blueAccent[400],
//                   fontSize: "18px",
//                   fontWeight: "bold",
//                   marginBottom: "5px",
//                 }}
//               >
//                 Faculty of Computing
//               </Typography>
//             }
//           />
//         </Box>
//         <Box
//           gridColumn="span 3"
//           backgroundColor={colors.primary[400]}
//           display="flex"
//           alignItems="center"
//           justifyContent="center"
//         >
//           <StatBox
//             title={totalProjectsByYear[2023] || 0}
//             subtitle="Trainings Conducted (2023)"
//             icon={
//               <Typography
//                 variant="caption"
//                 sx={{
//                   color: colors.blueAccent[600],
//                   fontSize: "14px",
//                   fontWeight: "bold",
//                 }}
//               >
//                 Yearly Data
//               </Typography>
//             }
//           />
//         </Box>

//         {/* ROW 2 */}
//         {/* <Box
//           gridColumn="span 8"
//           gridRow="span 2"
//           backgroundColor={colors.primary[400]}
//         >
//           <Box
//             mt="25px"
//             p="0 30px"
//             display="flex "
//             justifyContent="space-between"
//             alignItems="center"
//           >
//             <Box>
//               <Typography
//                 variant="h5"
//                 fontWeight="600"
//                 color={colors.grey[100]}
//               >
//                 Revenue Generated
//               </Typography>
//               <Typography
//                 variant="h3"
//                 fontWeight="bold"
//                 color={colors.greenAccent[500]}
//               >
//                 $59,342.32
//               </Typography>
//             </Box>
//             <Box>
//               <IconButton>
//                 <DownloadOutlinedIcon
//                   sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
//                 />
//               </IconButton>
//             </Box>
//           </Box>
//           <Box height="250px" m="-20px 0 0 0">
//             <LineChart isDashboard={true} />
//           </Box>
//         </Box> */}

//         {/* ROW 3 */}
//         <Box
//           gridColumn="span 5"
//           gridRow="span 3"
//           backgroundColor={colors.primary[400]}
//           p="30px"
//         >
//           <Typography variant="h5" fontWeight="600">
//             Faculty of Computing
//           </Typography>
//           <Box height="300px" width="100%">
//             <Pie />
//             <Typography
//               variant="h5"
//               color={colors.greenAccent[500]}
//               sx={{ mt: "15px" }}
//             >
//               Total:374
//             </Typography>
//             <Typography>
//               Includes National(Industrial) & International Grants
//             </Typography>
//           </Box>
//         </Box>
//         <Box
//           gridColumn="span 7"
//           gridRow="span 3"
//           backgroundColor={colors.primary[400]}
//           p="5px"
//         >
//           <Typography variant="h5" fontWeight="600">
//             Faculty of Computing
//           </Typography>
//           <Box height="300px" width="100%">
//             <Pie2 />
//             <Typography
//               variant="h5"
//               color={colors.greenAccent[500]}
//               sx={{ mt: "15px" }}
//             >
//               Total:374
//             </Typography>
//             <Typography>
//               Includes National(Industrial) & International Grants
//             </Typography>
//           </Box>
//         </Box>
//         <Box
//           gridColumn="span 6"
//           gridRow="span 4"
//           backgroundColor={colors.primary[400]}
//         >
//           <Typography
//             variant="h5"
//             fontWeight="600"
//             sx={{ padding: "30px 30px 0 30px" }}
//           >
//             Sales Quantity
//           </Typography>
//           <Box height="520px" mt="-20px">
//             <BarChart isDashboard={true} />
//           </Box>
//         </Box>
//         <Box
//           gridColumn="span 6"
//           gridRow="span 4"
//           backgroundColor={colors.primary[400]}
//         >
//           <Typography
//             variant="h5"
//             fontWeight="600"
//             sx={{ padding: "30px 30px 0 30px" }}
//           >
//             Publications
//           </Typography>
//           <Box height="500px" mt="-20px">
//             <Publications isDashboard={true} />
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default Dashboard;

// import { Box, Typography, useTheme } from "@mui/material";
// import { useEffect, useState } from "react";
// import { tokens } from "../../theme";
// import StatBox from "../../components/StatBox";
// import Header from "../../components/Header";
// import scholarData from "../../data/scraped_scholar_data.json";
// import trainingData from "../../data/training.json";

// const Dashboard = () => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   const [totalStaff, setTotalStaff] = useState(0);
//   const [totalResearchGroups, setTotalResearchGroups] = useState(0);

//   // Fetch total staff and total research groups from the backend
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const staffResponse = await fetch(
//           "http://localhost:5000/api/totalStaff"
//         );
//         if (!staffResponse.ok) throw new Error("Failed to fetch total staff");
//         const staffData = await staffResponse.json();
//         setTotalStaff(staffData.totalStaff);

//         const groupsResponse = await fetch(
//           "http://localhost:5000/api/research-groups"
//         );
//         if (!groupsResponse.ok)
//           throw new Error("Failed to fetch research groups");
//         const groupsData = await groupsResponse.json();
//         const filteredGroups = groupsData.filter((group) => group !== "N/A");
//         setTotalResearchGroups(filteredGroups.length);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   // Summing up H-Index, Citations, and Publications
//   const totalHIndex = scholarData.reduce(
//     (sum, scholar) => sum + scholar["H-INDEXED (SCOPUS)"],
//     0
//   );
//   const totalCitations = scholarData.reduce(
//     (sum, scholar) => sum + scholar["CITATIONS (SCOPUS)"],
//     0
//   );
//   const totalPublications = scholarData.reduce(
//     (sum, scholar) => sum + scholar["PUBLICATIONS"],
//     0
//   );
//   const totalGrants = scholarData.reduce(
//     (sum, scholar) => sum + scholar["GRANT(PI & MEMBERS)"],
//     0
//   );
//   const totalIPublications = scholarData.reduce(
//     (sum, scholar) => sum + scholar["INDEXED PUBLICATION"],
//     0
//   );
//   const sumProjectsByYear = (data) => {
//     return data.reduce((acc, item) => {
//       const year = item.Year;
//       acc[year] = (acc[year] || 0) + 1;
//       return acc;
//     }, {});
//   };
//   const totalProjectsByYear = sumProjectsByYear(trainingData);

//   return (
//     <Box m="20px">
//       {/* HEADER */}
//       <Box display="flex" justifyContent="space-between" alignItems="center">
//         <Header title="FC Scholar Dashboard" subtitle="Faculty of Computing" />
//       </Box>

//       {/* GRID & CHARTS */}
//       <Box
//         display="grid"
//         gridTemplateColumns="repeat(12, 1fr)"
//         gridAutoRows="140px"
//         gap="20px"
//       >
//         {/* ROW 1 */}
//         <Box
//           gridColumn="span 12"
//           backgroundColor={colors.primary[400]}
//           display="flex"
//           alignItems="center"
//           justifyContent="space-around"
//           padding="20px"
//         >
//           <Box textAlign="center">
//             <Typography
//               sx={{
//                 fontSize: "36px",
//                 fontWeight: "bold",
//                 color: colors.blueAccent[400],
//               }}
//             >
//               {totalStaff.toLocaleString()}
//             </Typography>
//             <Typography
//               sx={{
//                 fontSize: "24px",
//                 fontWeight: "medium",
//                 color: colors.greenAccent[300],
//               }}
//             >
//               Total Staff
//             </Typography>
//           </Box>
//           <Box textAlign="center">
//             <Typography
//               sx={{
//                 fontSize: "36px",
//                 fontWeight: "bold",
//                 color: colors.blueAccent[400],
//               }}
//             >
//               {totalResearchGroups.toLocaleString()}
//             </Typography>
//             <Typography
//               sx={{
//                 fontSize: "24px",
//                 fontWeight: "medium",
//                 color: colors.greenAccent[300],
//               }}
//             >
//               Research Groups
//             </Typography>
//           </Box>
//         </Box>

//         {/* Additional StatBoxes for other metrics */}
//         <Box
//           gridColumn="span 3"
//           backgroundColor={colors.primary[400]}
//           display="flex"
//           alignItems="center"
//           justifyContent="center"
//         >
//           <StatBox
//             title={totalIPublications.toLocaleString()}
//             subtitle="Indexed Publications"
//           />
//         </Box>
//         <Box
//           gridColumn="span 3"
//           backgroundColor={colors.primary[400]}
//           display="flex"
//           alignItems="center"
//           justifyContent="center"
//         >
//           <StatBox
//             title={totalPublications.toLocaleString()}
//             subtitle="Publications"
//           />
//         </Box>
//         <Box
//           gridColumn="span 3"
//           backgroundColor={colors.primary[400]}
//           display="flex"
//           alignItems="center"
//           justifyContent="center"
//         >
//           <StatBox
//             title={totalCitations.toLocaleString()}
//             subtitle="Citations"
//           />
//         </Box>
//         <Box
//           gridColumn="span 3"
//           backgroundColor={colors.primary[400]}
//           display="flex"
//           alignItems="center"
//           justifyContent="center"
//         >
//           <StatBox title={totalHIndex.toLocaleString()} subtitle="H-Index" />
//         </Box>
//         <Box
//           gridColumn="span 3"
//           backgroundColor={colors.primary[400]}
//           display="flex"
//           alignItems="center"
//           justifyContent="center"
//         >
//           <StatBox
//             title={totalGrants.toLocaleString()}
//             subtitle="Grants (PI & Members)"
//           />
//         </Box>
//         <Box
//           gridColumn="span 3"
//           backgroundColor={colors.primary[400]}
//           display="flex"
//           alignItems="center"
//           justifyContent="center"
//         >
//           <StatBox
//             title={totalProjectsByYear[2024] || 0}
//             subtitle="Trainings Conducted (2024)"
//           />
//         </Box>
//         <Box
//           gridColumn="span 3"
//           backgroundColor={colors.primary[400]}
//           display="flex"
//           alignItems="center"
//           justifyContent="center"
//         >
//           <StatBox
//             title={totalProjectsByYear[2023] || 0}
//             subtitle="Trainings Conducted (2023)"
//           />
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default Dashboard;
// Best Solution
// import { Box, Typography, useTheme } from "@mui/material";
// import { useEffect, useState } from "react";
// import { tokens } from "../../theme";
// import StatBox from "../../components/StatBox";
// import Header from "../../components/Header";
// import PieChart from "../../components/PieChart";
// import BarChart from "../../components/BarChart";
// import scholarData from "../../data/scraped_scholar_data.json";
// import trainingData from "../../data/training.json";

// const Dashboard = () => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   const [totalStaff, setTotalStaff] = useState(0);
//   const [totalResearchGroups, setTotalResearchGroups] = useState(0);

//   // Fetch total staff and total research groups from the backend
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const staffResponse = await fetch(
//           "http://localhost:5000/api/totalStaff"
//         );
//         if (!staffResponse.ok) throw new Error("Failed to fetch total staff");
//         const staffData = await staffResponse.json();
//         setTotalStaff(staffData.totalStaff);

//         const groupsResponse = await fetch(
//           "http://localhost:5000/api/research-groups"
//         );
//         if (!groupsResponse.ok)
//           throw new Error("Failed to fetch research groups");
//         const groupsData = await groupsResponse.json();
//         const filteredGroups = groupsData.filter((group) => group !== "N/A");
//         setTotalResearchGroups(filteredGroups.length);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   // Summing up H-Index, Citations, and Publications
//   const totalHIndex = scholarData.reduce(
//     (sum, scholar) => sum + scholar["H-INDEXED (SCOPUS)"],
//     0
//   );
//   const totalCitations = scholarData.reduce(
//     (sum, scholar) => sum + scholar["CITATIONS (SCOPUS)"],
//     0
//   );
//   const totalPublications = scholarData.reduce(
//     (sum, scholar) => sum + scholar["PUBLICATIONS"],
//     0
//   );
//   const totalGrants = scholarData.reduce(
//     (sum, scholar) => sum + scholar["GRANT(PI & MEMBERS)"],
//     0
//   );
//   const totalIPublications = scholarData.reduce(
//     (sum, scholar) => sum + scholar["INDEXED PUBLICATION"],
//     0
//   );
//   const sumProjectsByYear = (data) => {
//     return data.reduce((acc, item) => {
//       const year = item.Year;
//       acc[year] = (acc[year] || 0) + 1;
//       return acc;
//     }, {});
//   };
//   const totalProjectsByYear = sumProjectsByYear(trainingData);

//   return (
//     <Box m="20px">
//       {/* HEADER */}
//       <Box display="flex" justifyContent="space-between" alignItems="center">
//         <Header title="Scholar Dashboard" subtitle="" />
//       </Box>

//       {/* GRID & CHARTS */}
//       <Box
//         display="grid"
//         gridTemplateColumns="repeat(12, 1fr)"
//         gridAutoRows="140px"
//         gap="20px"
//       >
//         {/* ROW 1 */}
//         <Box
//           gridColumn="span 12"
//           backgroundColor={colors.primary[400]}
//           display="flex"
//           alignItems="center"
//           justifyContent="space-around"
//           padding="20px"
//         >
//           <Box textAlign="center">
//             <Typography
//               sx={{
//                 fontSize: "36px",
//                 fontWeight: "bold",
//                 color: colors.blueAccent[400],
//               }}
//             >
//               {totalStaff.toLocaleString()}
//             </Typography>
//             <Typography
//               sx={{
//                 fontSize: "24px",
//                 fontWeight: "medium",
//                 color: colors.greenAccent[300],
//               }}
//             >
//               Total Staff
//             </Typography>
//           </Box>
//           <Box textAlign="center">
//             <Typography
//               sx={{
//                 fontSize: "36px",
//                 fontWeight: "bold",
//                 color: colors.blueAccent[400],
//               }}
//             >
//               {totalResearchGroups.toLocaleString()}
//             </Typography>
//             <Typography
//               sx={{
//                 fontSize: "24px",
//                 fontWeight: "medium",
//                 color: colors.greenAccent[300],
//               }}
//             >
//               Research Groups
//             </Typography>
//           </Box>
//         </Box>

//         {/* Additional StatBoxes for other metrics */}
//         <Box
//           gridColumn="span 3"
//           backgroundColor={colors.primary[400]}
//           display="flex"
//           alignItems="center"
//           justifyContent="center"
//         >
//           <StatBox
//             title={totalIPublications.toLocaleString()}
//             subtitle="Indexed Publications"
//           />
//         </Box>
//         <Box
//           gridColumn="span 3"
//           backgroundColor={colors.primary[400]}
//           display="flex"
//           alignItems="center"
//           justifyContent="center"
//         >
//           <StatBox
//             title={totalPublications.toLocaleString()}
//             subtitle="Publications"
//           />
//         </Box>
//         <Box
//           gridColumn="span 3"
//           backgroundColor={colors.primary[400]}
//           display="flex"
//           alignItems="center"
//           justifyContent="center"
//         >
//           <StatBox
//             title={totalCitations.toLocaleString()}
//             subtitle="Citations"
//           />
//         </Box>
//         <Box
//           gridColumn="span 3"
//           backgroundColor={colors.primary[400]}
//           display="flex"
//           alignItems="center"
//           justifyContent="center"
//         >
//           <StatBox title={totalHIndex.toLocaleString()} subtitle="H-Index" />
//         </Box>
//         <Box
//           gridColumn="span 3"
//           backgroundColor={colors.primary[400]}
//           display="flex"
//           alignItems="center"
//           justifyContent="center"
//         >
//           <StatBox
//             title={totalGrants.toLocaleString()}
//             subtitle="Grants (PI & Members)"
//           />
//         </Box>
//         <Box
//           gridColumn="span 3"
//           backgroundColor={colors.primary[400]}
//           display="flex"
//           alignItems="center"
//           justifyContent="center"
//         >
//           <StatBox
//             title={totalProjectsByYear[2024] || 0}
//             subtitle="Trainings Conducted (2024)"
//           />
//         </Box>
//         <Box
//           gridColumn="span 3"
//           backgroundColor={colors.primary[400]}
//           display="flex"
//           alignItems="center"
//           justifyContent="center"
//         >
//           <StatBox
//             title={totalProjectsByYear[2023] || 0}
//             subtitle="Trainings Conducted (2023)"
//           />
//         </Box>

//         {/* CHARTS */}
//         <Box
//           gridColumn="span 6"
//           gridRow="span 5"
//           backgroundColor={colors.primary[400]}
//           p="20px"
//         >
//           <Typography variant="h5" fontWeight="600" textAlign="center">
//             Grants Overview
//           </Typography>
//           <Box
//             height="300px"
//             width="100%"
//             display="flex"
//             justifyContent="center"
//             alignItems="center"
//           >
//             <PieChart style={{ height: "250px", width: "250px" }} />
//           </Box>
//         </Box>

//         <Box
//           gridColumn="span 6"
//           gridRow="span 5"
//           backgroundColor={colors.primary[400]}
//           p="20px"
//         >
//           <Typography variant="h5" fontWeight="600" textAlign="center">
//             Publications and Citations
//           </Typography>
//           <Box
//             height="300px"
//             width="100%"
//             display="flex"
//             justifyContent="center"
//             alignItems="center"
//           >
//             <BarChart style={{ height: "250px", width: "250px" }} />
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default Dashboard;
import { Box, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { tokens } from "../../theme";
import StatBox from "../../components/StatBox";
import Header from "../../components/Header";
import PieChart from "../../components/PieChart";
import BarChart from "../../components/BarChart";
import GPieChart from "../../components/GPie";
import GBarChart from "../../components/GBar";
import scholarData from "../../data/scraped_scholar_data.json";
import trainingData from "../../data/training.json";
import PublicationsBarChart from "../../components/PublicationBarChart";
import PublicationsPieChart from "../../components/PublicationPieChart";
import PubStackedBarChart from "../../components/PubBar";
import HIndexBarChart from "../../components/CitationBar";
import NetworkingBarChart from "../../components/NetworkingBar";
import NetworkingLineChart from "../../components/NetworkingLine";
import BarTraining from "../../components/BarTraining";
import LineChart from "../../components/TrainingLineChart";
import ConferenceBarChart from "../../components/ConferenceBar";
import ConferenceLineChart from "../../components/conferenceLine";
import ResearchGroupBarChart from "../../components/IpBar";
import CitationsScopusChart from "../../components/PieLikeChart";
const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [totalStaff, setTotalStaff] = useState(0);
  const [totalResearchGroups, setTotalResearchGroups] = useState(0);
  const [totalPublications, setTotalPublications] = useState(0);
  const [indexedPublications, setIndexedPublications] = useState(0);
  const [nonIndexedPublications, setNonIndexedPublications] = useState(0);
  const [otherPublications, setOtherPublications] = useState(0);
  const [grants, setGrants] = useState({
    totalGrants: 0,
    nationalGrants: 0,
    internationalGrants: 0,
    industryGrants: 0,
  });
  const [piData, setPiData] = useState({
    hIndexedScopus: 0,
    citationsScopus: 0,
    Pi: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const staffResponse = await fetch(
          "http://localhost:5000/api/totalStaff"
        );
        if (!staffResponse.ok) throw new Error("Failed to fetch total staff");
        const staffData = await staffResponse.json();
        setTotalStaff(staffData.totalStaff);

        const groupsResponse = await fetch(
          "http://localhost:5000/api/research-groups"
        );
        if (!groupsResponse.ok)
          throw new Error("Failed to fetch research groups");
        const groupsData = await groupsResponse.json();
        const filteredGroups = groupsData.filter((group) => group !== "N/A");
        setTotalResearchGroups(filteredGroups.length);

        const publicationsResponse = await fetch(
          "http://localhost:5000/api/publications"
        );
        const publicationsData = await publicationsResponse.json();

        setIndexedPublications(publicationsData.indexedPublications);
        setNonIndexedPublications(publicationsData.nonIndexedPublications);
        setOtherPublications(publicationsData.otherPublications);

        const totalPub =
          publicationsData.indexedPublications +
          publicationsData.nonIndexedPublications +
          publicationsData.otherPublications;
        setTotalPublications(totalPub);
        const grantsResponse = await fetch("http://localhost:5000/api/grants");
        const grantsData = await grantsResponse.json();
        const totalGrants =
          grantsData.nationalGrants +
          grantsData.internationalGrants +
          grantsData.industryGrants;

        setGrants({
          totalGrants,
          nationalGrants: grantsData.nationalGrants,
          internationalGrants: grantsData.internationalGrants,
          industryGrants: grantsData.industryGrants,
        });
        const piResponse = await fetch("http://localhost:5000/api/piData");
        const piData = await piResponse.json();
        setPiData({
          hIndexedScopus: piData.hIndexedScopus,
          citationsScopus: piData.citationsScopus,
          Pi: piData.Pi,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Summing up H-Index, Citations, and Publications
  const totalHIndex = scholarData.reduce(
    (sum, scholar) => sum + scholar["H-INDEXED (SCOPUS)"],
    0
  );
  const totalCitations = scholarData.reduce(
    (sum, scholar) => sum + scholar["CITATIONS (SCOPUS)"],
    0
  );
  const totalGrants = scholarData.reduce(
    (sum, scholar) => sum + scholar["GRANT(PI & MEMBERS)"],
    0
  );
  const totalIPublications = scholarData.reduce(
    (sum, scholar) => sum + scholar["INDEXED PUBLICATION"],
    0
  );
  const sumProjectsByYear = (data) => {
    return data.reduce((acc, item) => {
      const year = item.Year;
      acc[year] = (acc[year] || 0) + 1;
      return acc;
    }, {});
  };
  const totalProjectsByYear = sumProjectsByYear(trainingData);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="FC Scholar Dashboard" subtitle="Faculty of Computing" />
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 12"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="space-around"
          padding="20px"
        >
          <Box textAlign="center">
            <Typography
              sx={{
                fontSize: "36px",
                fontWeight: "bold",
                color: colors.blueAccent[400],
              }}
            >
              {totalStaff.toLocaleString()}
            </Typography>
            <Typography
              sx={{
                fontSize: "24px",
                fontWeight: "medium",
                color: colors.greenAccent[300],
              }}
            >
              Total Staff
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography
              sx={{
                fontSize: "36px",
                fontWeight: "bold",
                color: colors.blueAccent[400],
              }}
            >
              {totalResearchGroups.toLocaleString()}
            </Typography>
            <Typography
              sx={{
                fontSize: "24px",
                fontWeight: "medium",
                color: colors.greenAccent[300],
              }}
            >
              Research Groups
            </Typography>
          </Box>
        </Box>
        {/* Publications StatBox */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          borderRadius="8px"
          p="20px"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap="20px"
        >
          {/* Top Section */}
          <Box textAlign="center">
            <Typography
              sx={{
                fontSize: "24px",
                fontWeight: "bold",
                color: colors.greenAccent[400],
              }}
            >
              Publications
            </Typography>
            <Typography
              sx={{
                fontSize: "32px",
                fontWeight: "bold",
                color: colors.blueAccent[400],
              }}
            >
              {totalPublications.toLocaleString()}
            </Typography>
          </Box>

          {/* Bottom Section */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            gap="15px"
            width="100%"
          >
            {/* Indexed Publications */}
            <Box
              flex="1"
              p="10px"
              border={`1px solid ${colors.greenAccent[400]}`}
              borderRadius="4px"
              textAlign="center"
            >
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: "medium",
                  color: colors.grey[100],
                }}
              >
                Indexed Publications
              </Typography>
              <Typography
                sx={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: colors.greenAccent[400],
                }}
              >
                {indexedPublications.toLocaleString()}
              </Typography>
            </Box>

            {/* Non-Indexed Publications */}
            <Box
              flex="1"
              p="10px"
              border={`1px solid ${colors.greenAccent[400]}`}
              borderRadius="4px"
              textAlign="center"
            >
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: "medium",
                  color: colors.grey[100],
                }}
              >
                Non-Indexed
              </Typography>
              <Typography
                sx={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: colors.greenAccent[400],
                }}
              >
                {nonIndexedPublications.toLocaleString()}
              </Typography>
            </Box>

            {/* Other Publications */}
            <Box
              flex="1"
              p="10px"
              border={`1px solid ${colors.greenAccent[400]}`}
              borderRadius="4px"
              textAlign="center"
            >
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: "medium",
                  color: colors.grey[100],
                }}
              >
                Other Publications
              </Typography>
              <Typography
                sx={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: colors.greenAccent[400],
                }}
              >
                {otherPublications.toLocaleString()}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          borderRadius="8px"
          p="20px"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap="20px"
        >
          {/* Top Section */}
          <Box textAlign="center">
            <Typography
              sx={{
                fontSize: "24px",
                fontWeight: "bold",
                color: colors.greenAccent[400],
              }}
            >
              Grants
            </Typography>
            <Typography
              sx={{
                fontSize: "32px",
                fontWeight: "bold",
                color: colors.blueAccent[400],
              }}
            >
              {grants.totalGrants.toLocaleString()}
            </Typography>
          </Box>

          {/* Bottom Section */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            gap="15px"
            width="100%"
          >
            <Box
              flex="1"
              p="10px"
              border={`1px solid ${colors.greenAccent[400]}`}
              borderRadius="4px"
              textAlign="center"
            >
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: "medium",
                  color: colors.grey[100],
                }}
              >
                National Grants
              </Typography>
              <Typography
                sx={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: colors.greenAccent[400],
                }}
              >
                {grants.nationalGrants.toLocaleString()}
              </Typography>
            </Box>

            <Box
              flex="1"
              p="10px"
              border={`1px solid ${colors.greenAccent[400]}`}
              borderRadius="4px"
              textAlign="center"
            >
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: "medium",
                  color: colors.grey[100],
                }}
              >
                International Grants
              </Typography>
              <Typography
                sx={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: colors.greenAccent[400],
                }}
              >
                {grants.internationalGrants.toLocaleString()}
              </Typography>
            </Box>

            {/* Industry Grants */}
            <Box
              flex="1"
              p="10px"
              border={`1px solid ${colors.greenAccent[400]}`}
              borderRadius="4px"
              textAlign="center"
            >
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: "medium",
                  color: colors.grey[100],
                }}
              >
                Industry Grants
              </Typography>
              <Typography
                sx={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: colors.greenAccent[400],
                }}
              >
                {grants.industryGrants.toLocaleString()}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          borderRadius="8px"
          p="0px"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap="15px"
        >
          <Box
            width="100%"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap="10px"
          >
            <Box
              width="100%"
              textAlign="center"
              borderBottom={`4px solid ${colors.brownAccent[400]}`}
              padding="10px"
            >
              <Typography
                sx={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: colors.greenAccent[400],
                }}
              >
                H-Indexed (Scopus)
              </Typography>
              <Typography
                sx={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: colors.blueAccent[400],
                }}
              >
                {piData.hIndexedScopus.toLocaleString()}
              </Typography>
            </Box>
            <Box
              width="100%"
              textAlign="center"
              borderBottom={`4px solid ${colors.brownAccent[400]}`}
              padding="10px"
            >
              <Typography
                sx={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: colors.greenAccent[400],
                }}
              >
                Citations (Scopus)
              </Typography>
              <Typography
                sx={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: colors.blueAccent[400],
                }}
              >
                {piData.citationsScopus.toLocaleString()}
              </Typography>
            </Box>
            <Box width="100%" textAlign="center" padding="10px">
              <Typography
                sx={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: colors.greenAccent[400],
                }}
              >
                Grants (PI & Members)
              </Typography>
              <Typography
                sx={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: colors.blueAccent[400],
                }}
              >
                {piData.Pi.toLocaleString()}
              </Typography>
            </Box>
          </Box>
        </Box>
        {/* Additional StatBoxes for other metrics */}

        {/* CHARTS */}
        <Box gridColumn="span 12" p="50px">
          <Typography
            variant="h4"
            fontWeight="700"
            textAlign="center"
            mb="20px" // Adds margin below the caption
          >
            Grants Data Summary
          </Typography>
        </Box>
        <Box
          gridColumn="span 6"
          gridRow="span 5"
          backgroundColor={colors.primary[400]}
          p="20px"
        >
          <Typography
            variant="h4"
            fontWeight="700"
            textAlign="center"
            fontSize="14px"
            mb="2px" // Adds margin below the caption
          >
            For a detailed description of the data, go to the "Grants" Section
            and click on the "Grants By RG Pie graph"
          </Typography>

          <Box
            height="300px"
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <PieChart style={{ height: "250px", width: "250px" }} />
          </Box>
        </Box>
        <Box
          gridColumn="span 6"
          gridRow="span 5"
          backgroundColor={colors.primary[400]}
          p="20px"
        >
          <Typography
            variant="h4"
            fontWeight="700"
            textAlign="center"
            fontSize="14px"
            mb="2px" // Adds margin below the caption
          >
            For a detailed description of the data, go to the "Grants" Section
            and click on the "Grants By RG Pie graph"
          </Typography>
          <Box
            height="300px"
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <BarChart style={{ height: "250px", width: "250px" }} />
          </Box>
        </Box>
        <Box gridColumn="span 12" p="50px">
          <Typography
            variant="h4"
            fontWeight="700"
            textAlign="center"
            mb="20px" // Adds margin below the caption
          >
            Grants Data By Year Summary
          </Typography>
        </Box>
        <Box
          gridColumn="span 12"
          gridRow="span 5"
          backgroundColor={colors.primary[400]}
          p="20px"
        >
          <Typography
            variant="h4"
            fontWeight="700"
            textAlign="center"
            mb="20px" // Adds margin below the caption
          >
            For a detailed description of the data, go to the "Grants" Section
            and click on the "Grants by Year Bar graph"
          </Typography>
          <Box
            height="300px"
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <GPieChart style={{ height: "250px", width: "250px" }} />
          </Box>
        </Box>
        {/* <Box
          gridColumn="span 12"
          gridRow="span 5"
          backgroundColor={colors.primary[400]}
          p="20px"
        >
          <Box
            height="300px"
            width="1000px"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <GBarChart style={{ height: "250px", width: "500px" }} />
          </Box>
        </Box> */}
        <Box gridColumn="span 12" p="50px">
          <Typography
            variant="h4"
            fontWeight="700"
            textAlign="center"
            mb="20px" // Adds margin below the caption
          >
            Publication Data Summary
          </Typography>
        </Box>
        <Box
          gridColumn="span 6"
          gridRow="span 5"
          backgroundColor={colors.primary[400]}
          p="20px"
        >
          <Box
            height="300px"
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <PublicationsPieChart style={{ height: "250px", width: "250px" }} />
          </Box>
        </Box>
        <Box
          gridColumn="span 6"
          gridRow="span 5"
          backgroundColor={colors.primary[400]}
          p="20px"
        >
          <Box
            height="300px"
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <PublicationsBarChart style={{ height: "250px", width: "250px" }} />
          </Box>
        </Box>
        <Box
          gridColumn="span 12"
          gridRow="span 5"
          backgroundColor={colors.primary[400]}
          p="20px"
        >
          <Box
            height="300px"
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <PubStackedBarChart style={{ height: "500px", width: "120px" }} />
          </Box>
        </Box>
        <Box gridColumn="span 12" p="50px">
          <Typography
            variant="h4"
            fontWeight="700"
            textAlign="center"
            mb="20px" // Adds margin below the caption
          >
            H-Index Data Summary
          </Typography>
        </Box>
        <Box
          gridColumn="span 12"
          gridRow="span 5"
          backgroundColor={colors.primary[400]}
          p="20px"
        >
          <Box
            height="300px"
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <HIndexBarChart style={{ height: "500px", width: "120px" }} />
          </Box>
        </Box>
        <Box gridColumn="span 12" p="50px">
          <Typography
            variant="h4"
            fontWeight="700"
            textAlign="center"
            mb="20px" // Adds margin below the caption
          >
            Networking Data Summary
          </Typography>
        </Box>
        <Box
          gridColumn="span 7"
          gridRow="span 4"
          backgroundColor={colors.primary[400]}
          p="20px"
        >
          <Box
            height="300px"
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <NetworkingBarChart style={{ height: "500px", width: "120px" }} />
          </Box>
        </Box>
        <Box
          gridColumn="span 5"
          gridRow="span 4"
          backgroundColor={colors.primary[400]}
          p="20px"
        >
          <Box
            height="300px"
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <NetworkingLineChart style={{ height: "500px", width: "120px" }} />
          </Box>
        </Box>
        <Box gridColumn="span 12" p="50px">
          <Typography
            variant="h4"
            fontWeight="700"
            textAlign="center"
            mb="20px" // Adds margin below the caption
          >
            Trainings Data Summary
          </Typography>
        </Box>
        <Box
          gridColumn="span 7"
          gridRow="span 4"
          backgroundColor={colors.primary[400]}
          p="20px"
        >
          <Box
            height="300px"
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <BarTraining style={{ height: "500px", width: "120px" }} />
          </Box>
        </Box>
        <Box
          gridColumn="span 5"
          gridRow="span 4"
          backgroundColor={colors.primary[400]}
          p="20px"
        >
          <Box
            height="300px"
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <LineChart style={{ height: "500px", width: "200px" }} />
          </Box>
        </Box>
        <Box gridColumn="span 12" p="50px">
          <Typography
            variant="h4"
            fontWeight="700"
            textAlign="center"
            mb="20px" // Adds margin below the caption
          >
            Conferences Data Summary
          </Typography>
        </Box>
        <Box
          gridColumn="span 7"
          gridRow="span 4"
          backgroundColor={colors.primary[400]}
          p="20px"
        >
          <Box
            height="300px"
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <ConferenceBarChart style={{ height: "500px", width: "120px" }} />
          </Box>
        </Box>
        <Box
          gridColumn="span 5"
          gridRow="span 4"
          backgroundColor={colors.primary[400]}
          p="20px"
        >
          <Box
            height="300px"
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <ConferenceLineChart style={{ height: "500px", width: "120px" }} />
          </Box>
        </Box>
        <Box gridColumn="span 12" p="50px">
          <Typography
            variant="h4"
            fontWeight="700"
            textAlign="center"
            mb="20px" // Adds margin below the caption
          >
            Intellectual Property Filed Data Summary
          </Typography>
        </Box>
        <Box
          gridColumn="span 12"
          gridRow="span 4"
          backgroundColor={colors.primary[400]}
          p="20px"
        >
          <Box
            height="300px"
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <ResearchGroupBarChart
              style={{ height: "500px", width: "120px" }}
            />
          </Box>
        </Box>
        <Box gridColumn="span 12" p="50px">
          <Typography
            variant="h4"
            fontWeight="700"
            textAlign="center"
            mb="20px" // Adds margin below the caption
          >
            Citations Data Summary
          </Typography>
        </Box>
        <Box
          gridColumn="span 12"
          gridRow="span 5"
          backgroundColor={colors.primary[400]}
          p="20px"
        >
          <Box
            height="300px"
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <CitationsScopusChart style={{ height: "500px", width: "100%" }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
