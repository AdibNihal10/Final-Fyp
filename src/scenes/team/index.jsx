// import React, { useState, useEffect } from "react";
// import { Box, Button, TextField, Modal, Typography } from "@mui/material";
// import { DataGrid } from "@mui/x-data-grid";

// const Projects = () => {
//   // States
//   const [rows, setRows] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     Bil: "",
//     "Ketua Projek": "",
//     Vot: "",
//     "Tajuk Projek": "",
//     Klien: "",
//     "Kos Projek": "",
//   });

//   const apiBaseUrl = "http://localhost:5000/api/trainingProjects";

//   // Load initial data
//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   const fetchProjects = async () => {
//     try {
//       const response = await fetch(apiBaseUrl);
//       if (!response.ok) throw new Error("Failed to fetch projects");
//       const data = await response.json();
//       setRows(data);
//     } catch (error) {
//       console.error("Error fetching projects:", error);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const method = formData.Bil ? "PUT" : "POST";
//       const endpoint = formData.Bil
//         ? `${apiBaseUrl}/${formData.Bil}`
//         : apiBaseUrl;

//       const response = await fetch(endpoint, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) throw new Error("Failed to save project");

//       setFormData({
//         Bil: "",
//         "Ketua Projek": "",
//         Vot: "",
//         "Tajuk Projek": "",
//         Klien: "",
//         "Kos Projek": "",
//       });
//       setIsModalOpen(false);
//       fetchProjects();
//     } catch (error) {
//       console.error("Error saving project:", error);
//     }
//   };

//   const handleDelete = async (Bil) => {
//     try {
//       const response = await fetch(`${apiBaseUrl}/${Bil}`, {
//         method: "DELETE",
//       });

//       if (!response.ok) throw new Error("Failed to delete project");

//       fetchProjects();
//     } catch (error) {
//       console.error("Error deleting project:", error);
//     }
//   };

//   const handleOpenModal = (
//     row = {
//       Bil: "",
//       "Ketua Projek": "",
//       Vot: "",
//       "Tajuk Projek": "",
//       Klien: "",
//       "Kos Projek": "",
//     }
//   ) => {
//     setFormData(row);
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   const columns = [
//     { field: "Bil", headerName: "ID", width: 90 },
//     { field: "Ketua Projek", headerName: "Project Leader", flex: 1 },
//     { field: "Vot", headerName: "Budget Code", width: 130 },
//     { field: "Tajuk Projek", headerName: "Project Title", flex: 2 },
//     { field: "Klien", headerName: "Client", flex: 1 },
//     { field: "Kos Projek", headerName: "Project Cost", width: 150 },
//     {
//       field: "actions",
//       headerName: "Actions",
//       flex: 1,
//       renderCell: (params) => (
//         <Box display="flex" gap="10px">
//           <Button
//             variant="contained"
//             color="primary"
//             size="small"
//             onClick={() => handleOpenModal(params.row)}
//           >
//             Edit
//           </Button>
//           <Button
//             variant="contained"
//             color="secondary"
//             size="small"
//             onClick={() => handleDelete(params.row.Bil)}
//           >
//             Delete
//           </Button>
//         </Box>
//       ),
//     },
//   ];

//   return (
//     <Box m="20px">
//       <Typography variant="h4" gutterBottom>
//         Project Management
//       </Typography>
//       <Button
//         variant="contained"
//         color="primary"
//         onClick={() => handleOpenModal()}
//       >
//         Add Project
//       </Button>
//       <Box mt="20px" height="70vh">
//         <DataGrid rows={rows} columns={columns} getRowId={(row) => row.Bil} />
//       </Box>

//       {/* Modal */}
//       <Modal open={isModalOpen} onClose={handleCloseModal}>
//         <Box
//           p="20px"
//           bgcolor="white"
//           borderRadius="8px"
//           boxShadow="24"
//           mx="auto"
//           my="20vh"
//           width="400px"
//         >
//           <form onSubmit={handleFormSubmit}>
//             <Typography variant="h6" mb="20px">
//               {formData.Bil ? "Edit Project" : "Add Project"}
//             </Typography>
//             <TextField
//               fullWidth
//               margin="normal"
//               label="Project Leader"
//               name="Ketua Projek"
//               value={formData["Ketua Projek"]}
//               onChange={handleChange}
//               required
//             />
//             <TextField
//               fullWidth
//               margin="normal"
//               label="Budget Code"
//               name="Vot"
//               type="number"
//               value={formData.Vot}
//               onChange={handleChange}
//               required
//             />
//             <TextField
//               fullWidth
//               margin="normal"
//               label="Project Title"
//               name="Tajuk Projek"
//               value={formData["Tajuk Projek"]}
//               onChange={handleChange}
//               required
//             />
//             <TextField
//               fullWidth
//               margin="normal"
//               label="Client"
//               name="Klien"
//               value={formData.Klien}
//               onChange={handleChange}
//               required
//             />
//             <TextField
//               fullWidth
//               margin="normal"
//               label="Project Cost"
//               name="Kos Projek"
//               type="number"
//               value={formData["Kos Projek"]}
//               onChange={handleChange}
//               required
//             />
//             <Box mt="20px" display="flex" justifyContent="space-between">
//               <Button
//                 variant="contained"
//                 color="secondary"
//                 onClick={handleCloseModal}
//               >
//                 Cancel
//               </Button>
//               <Button variant="contained" color="primary" type="submit">
//                 Save
//               </Button>
//             </Box>
//           </form>
//         </Box>
//       </Modal>
//     </Box>
//   );
// };

// export default Projects;

import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Modal, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const Projects = () => {
  // States
  const [rows, setRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    _id: null, // MongoDB _id for updates
    Bil: "",
    KetuaProjek: "",
    Vot: "",
    TajukProjek: "",
    Klien: "",
    KosProjek: "",
    Year: "", // Add Year field
  });

  const apiBaseUrl = "http://localhost:5000/api/trainingProjects";

  // Load initial data
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(apiBaseUrl);
      if (!response.ok) throw new Error("Failed to fetch projects");
      const data = await response.json();
      setRows(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        Bil: parseInt(formData.Bil, 10) || rows.length + 1,
        KetuaProjek: formData.KetuaProjek.toString(),
        Vot: parseInt(formData.Vot, 10),
        TajukProjek: formData.TajukProjek.toString(),
        Klien: formData.Klien.toString(),
        KosProjek: parseFloat(formData.KosProjek),
        Year: parseInt(formData.Year, 10), // Parse Year as a number
      };

      console.log("Formatted data before submission:", formattedData);

      if (formData._id) {
        const response = await fetch(`${apiBaseUrl}/${formData._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedData),
        });
        if (!response.ok) throw new Error("Failed to update project");
      } else {
        const response = await fetch(apiBaseUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedData),
        });
        if (!response.ok) throw new Error("Failed to add project");
      }

      setFormData({
        _id: null,
        Bil: "",
        KetuaProjek: "",
        Vot: "",
        TajukProjek: "",
        Klien: "",
        KosProjek: "",
        Year: "", // Reset Year field
      });
      setIsModalOpen(false);
      fetchProjects();
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  const handleDelete = async (_id) => {
    try {
      const response = await fetch(`${apiBaseUrl}/${_id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete project");

      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleOpenModal = (
    row = {
      _id: null,
      Bil: "",
      KetuaProjek: "",
      Vot: "",
      TajukProjek: "",
      Klien: "",
      KosProjek: "",
      Year: "", // Include Year in the default row object
    }
  ) => {
    setFormData(row);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const columns = [
    { field: "Bil", headerName: "ID", width: 90 },
    { field: "KetuaProjek", headerName: "Project Leader", flex: 1 },
    { field: "Vot", headerName: "Budget Code", width: 130 },
    { field: "TajukProjek", headerName: "Project Title", flex: 2 },
    { field: "Klien", headerName: "Client", flex: 1 },
    { field: "KosProjek", headerName: "Project Cost", width: 150 },
    { field: "Year", headerName: "Year", width: 100 }, // Add Year column
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" gap="10px">
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleOpenModal(params.row)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => handleDelete(params.row._id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Typography variant="h4" gutterBottom>
        Project Management
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenModal()}
      >
        Add Project
      </Button>
      <Box mt="20px" height="70vh">
        <DataGrid rows={rows} columns={columns} getRowId={(row) => row._id} />
      </Box>

      {/* Modal */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          p="20px"
          bgcolor="white"
          borderRadius="8px"
          boxShadow="24"
          mx="auto"
          my="20vh"
          width="400px"
        >
          <form onSubmit={handleFormSubmit}>
            <Typography variant="h6" mb="20px">
              {formData._id ? "Edit Project" : "Add Project"}
            </Typography>
            <TextField
              fullWidth
              margin="normal"
              label="Project Leader"
              name="KetuaProjek"
              value={formData.KetuaProjek}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Budget Code"
              name="Vot"
              type="number"
              value={formData.Vot}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Project Title"
              name="TajukProjek"
              value={formData.TajukProjek}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Client"
              name="Klien"
              value={formData.Klien}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Project Cost"
              name="KosProjek"
              type="number"
              value={formData.KosProjek}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Year"
              name="Year"
              type="number"
              value={formData.Year}
              onChange={handleChange}
              required
            />
            <Box mt="20px" display="flex" justifyContent="space-between">
              <Button
                variant="contained"
                color="secondary"
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
              <Button variant="contained" color="primary" type="submit">
                Save
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default Projects;
