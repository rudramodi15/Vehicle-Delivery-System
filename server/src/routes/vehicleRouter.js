const express = require('express');
const {
    createVehicle,
    getVehicles,
    searchVehicles,
    updateVehicle,
    deleteVehicle,
    purchaseVehicle,
    restockVehicle,
} = require('../controllers/vehicleController');
const { authenticateUser, authAdmin } = require('../middlewares/verifyAuth');

const router = express.Router();

// Enforce authentication on all inventory endpoints
router.use(authenticateUser);

router.get('/search', searchVehicles);
router.get('/', getVehicles);
router.post('/', createVehicle);
router.put('/:id', updateVehicle);
router.delete('/:id', authAdmin, deleteVehicle);

// Stock transaction endpoints
router.post('/:id/purchase', purchaseVehicle);
router.post('/:id/restock', authAdmin, restockVehicle);

module.exports = router;
