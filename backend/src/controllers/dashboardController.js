const dashboardService = require("../services/dashboardService");

// Dashboard étudiant — toutes les données contextuelles en un appel
const getStudentDashboard = async (req, res, next) => {
  try {
    const dashboard = await dashboardService.getStudentDashboard(req.user);
    res.json(dashboard);
  } catch (error) {
    next(error);
  }
};

// Dashboard admin — statistiques globales de la plateforme
const getAdminDashboard = async (req, res, next) => {
  try {
    const dashboard = await dashboardService.getAdminDashboard();
    res.json(dashboard);
  } catch (error) {
    next(error);
  }
};

module.exports = { getStudentDashboard, getAdminDashboard };
