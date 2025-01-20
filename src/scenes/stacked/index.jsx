import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Modal, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const Conferences = () => {
  // States
  const [rows, setRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    _id: null, // MongoDB _id for updates
    Title: "",
    Date: "",
    Year: "",
    Venue: "",
    Note: "",
  });

  const apiBaseUrl = "http://localhost:5000/api/conferences";

  // Load initial data
  useEffect(() => {
    fetchConferences();
  }, []);

  const fetchConferences = async () => {
    try {
      const response = await fetch(apiBaseUrl);
      if (!response.ok) throw new Error("Failed to fetch conferences");
      const data = await response.json();
      setRows(data);
    } catch (error) {
      console.error("Error fetching conferences:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const nextNo =
        rows.length > 0 ? Math.max(...rows.map((row) => row.No)) + 1 : 1; // Auto-increment No

      const formattedData = {
        No: nextNo,
        Title: formData.Title,
        Date: formData.Date,
        Year: parseInt(formData.Year, 10),
        Venue: formData.Venue,
        Note: formData.Note,
      };

      if (formData._id) {
        // Update existing conference
        const response = await fetch(`${apiBaseUrl}/${formData._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedData),
        });
        if (!response.ok) throw new Error("Failed to update conference");
      } else {
        // Create new conference
        const response = await fetch(apiBaseUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedData),
        });
        if (!response.ok) throw new Error("Failed to add conference");
      }

      setFormData({
        _id: null,
        Title: "",
        Date: "",
        Year: "",
        Venue: "",
        Note: "",
      });
      setIsModalOpen(false);
      fetchConferences();
    } catch (error) {
      console.error("Error saving conference:", error);
    }
  };

  const handleDelete = async (_id) => {
    try {
      const response = await fetch(`${apiBaseUrl}/${_id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete conference");
      fetchConferences();
    } catch (error) {
      console.error("Error deleting conference:", error);
    }
  };

  const handleOpenModal = (
    row = {
      _id: null,
      Title: "",
      Date: "",
      Year: "",
      Venue: "",
      Note: "",
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
    { field: "Title", headerName: "Title", flex: 1 },
    { field: "Date", headerName: "Date", width: 180 },
    { field: "Year", headerName: "Year", width: 120 },
    { field: "Venue", headerName: "Venue", flex: 1 },
    { field: "Note", headerName: "Note", flex: 1 },
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
        Conference Management
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenModal()}
      >
        Add Conference
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
              {formData._id ? "Edit Conference" : "Add Conference"}
            </Typography>
            <TextField
              fullWidth
              margin="normal"
              label="Title"
              name="Title"
              value={formData.Title}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Date"
              name="Date"
              value={formData.Date}
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
            <TextField
              fullWidth
              margin="normal"
              label="Venue"
              name="Venue"
              value={formData.Venue}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Note"
              name="Note"
              value={formData.Note}
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

export default Conferences;
