import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Modal, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const Agreements = () => {
  // States
  const [rows, setRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    _id: null,
    No: "",
    Description: "",
    Type: "",
    StartYear: "",
    EndYear: "",
    YearStart: "",
    YearEnd: "",
    PIC: "",
  });

  const apiBaseUrl = "http://localhost:5000/api/moumoa";

  // Load initial data
  useEffect(() => {
    fetchAgreements();
  }, []);

  const fetchAgreements = async () => {
    try {
      const response = await fetch(apiBaseUrl);
      if (!response.ok) throw new Error("Failed to fetch agreements");
      const data = await response.json();
      setRows(data);
    } catch (error) {
      console.error("Error fetching agreements:", error);
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
        No: rows.length > 0 ? Math.max(...rows.map((row) => row.No)) + 1 : 1,
        Description: formData.Description,
        Type: formData.Type,
        StartYear: formData.StartYear,
        EndYear: formData.EndYear,
        YearStart: parseInt(formData.StartYear.split(" ")[2], 10), // Extract year from StartYear
        YearEnd: parseInt(formData.EndYear.split(" ")[2], 10), // Extract year from EndYear
        PIC: formData.PIC,
      };

      if (formData._id) {
        // Update existing agreement
        const response = await fetch(`${apiBaseUrl}/${formData._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedData),
        });
        if (!response.ok) throw new Error("Failed to update agreement");
      } else {
        // Create new agreement
        const response = await fetch(apiBaseUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedData),
        });
        if (!response.ok) throw new Error("Failed to add agreement");
      }

      setFormData({
        _id: null,
        No: "",
        Description: "",
        Type: "",
        StartYear: "",
        EndYear: "",
        YearStart: "",
        YearEnd: "",
        PIC: "",
      });
      setIsModalOpen(false);
      fetchAgreements();
    } catch (error) {
      console.error("Error saving agreement:", error);
    }
  };

  const handleDelete = async (_id) => {
    try {
      const response = await fetch(`${apiBaseUrl}/${_id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete agreement");
      fetchAgreements();
    } catch (error) {
      console.error("Error deleting agreement:", error);
    }
  };

  const handleOpenModal = (
    row = {
      _id: null,
      No: "",
      Description: "",
      Type: "",
      StartYear: "",
      EndYear: "",
      YearStart: "",
      YearEnd: "",
      PIC: "",
    }
  ) => {
    setFormData(row);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const columns = [
    { field: "No", headerName: "No", width: 90 },
    { field: "Description", headerName: "Description", flex: 2 },
    { field: "Type", headerName: "Type", width: 120 },
    { field: "StartYear", headerName: "Start Year", width: 180 },
    { field: "EndYear", headerName: "End Year", width: 180 },
    { field: "YearStart", headerName: "Year Start", width: 120 },
    { field: "YearEnd", headerName: "Year End", width: 120 },
    { field: "PIC", headerName: "PIC", flex: 1 },
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
        MoU/MoA Management
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenModal()}
      >
        Add Agreement
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
              {formData._id ? "Edit Agreement" : "Add Agreement"}
            </Typography>
            <TextField
              fullWidth
              margin="normal"
              label="Description"
              name="Description"
              value={formData.Description}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Type"
              name="Type"
              value={formData.Type}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Start Year"
              name="StartYear"
              value={formData.StartYear}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="End Year"
              name="EndYear"
              value={formData.EndYear}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="PIC"
              name="PIC"
              value={formData.PIC}
              onChange={handleChange}
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

export default Agreements;
