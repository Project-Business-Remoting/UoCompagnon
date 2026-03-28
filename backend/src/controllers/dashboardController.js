const dashboardService = require("../services/dashboardService");

// Dashboard étudiant — toutes les données contextuelles en un appel
const getStudentDashboard = async (req, res) => {
  try {
    const dashboard = await dashboardService.getStudentDashboard(req.user);
    res.json(dashboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Dashboard admin — statistiques globales de la plateforme
const getAdminDashboard = async (req, res) => {
  try {
    const dashboard = await dashboardService.getAdminDashboard();
    res.json(dashboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStudentDashboard, getAdminDashboard };
