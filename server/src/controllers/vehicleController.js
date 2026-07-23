const Vehicle = require('../models/vehicleSchema');

/**
 * POST /api/vehicles - Create new vehicle entry
 */
const createVehicle = async (req, res) => {
  try {
    const { make, model, category, price, quantity } = req.body;
    if (!make || !model || !category || price === undefined || quantity === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const vehicle = await Vehicle.create({
      make,
      model,
      category,
      price,
      quantity,
    });

    res.status(201).json({
      message: 'Vehicle created successfully',
      vehicle,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/vehicles - Retrieve full vehicle inventory
 */
const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json({ vehicles });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/vehicles/search - Query vehicles by criteria
 */
const searchVehicles = async (req, res) => {
  try {
    const { make, model, category, minPrice, maxPrice } = req.query;
    const filterQuery = {};

    if (make) filterQuery.make = { $regex: make, $options: 'i' };
    if (model) filterQuery.model = { $regex: model, $options: 'i' };
    if (category) filterQuery.category = { $regex: category, $options: 'i' };

    if (minPrice || maxPrice) {
      filterQuery.price = {};
      if (minPrice) filterQuery.price.$gte = Number(minPrice);
      if (maxPrice) filterQuery.price.$lte = Number(maxPrice);
    }

    const vehicles = await Vehicle.find(filterQuery);
    res.status(200).json({ vehicles });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * PUT /api/vehicles/:id - Update existing vehicle specification
 */
const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const { make, model, category, price, quantity } = req.body;

    const item = await Vehicle.findById(id);
    if (!item) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    if (make !== undefined) item.make = make;
    if (model !== undefined) item.model = model;
    if (category !== undefined) item.category = category;
    if (price !== undefined) item.price = price;
    if (quantity !== undefined) item.quantity = quantity;

    await item.save();
    res.status(200).json({ message: 'Vehicle updated successfully', vehicle: item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * DELETE /api/vehicles/:id - Remove vehicle (Admin restriction)
 */
const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Vehicle.findById(id);
    if (!item) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    await item.deleteOne();
    res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * POST /api/vehicles/:id/purchase - Deduct stock by 1
 */
const purchaseVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Vehicle.findById(id);

    if (!item) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    if (item.quantity <= 0) {
      return res.status(400).json({ error: 'Vehicle is out of stock' });
    }

    item.quantity -= 1;
    await item.save();

    res.status(200).json({ message: 'Vehicle purchased successfully', vehicle: item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * POST /api/vehicles/:id/restock - Replenish vehicle stock (Admin restriction)
 */
const restockVehicle = async (req, res) => {
  try {
    const { amount } = req.body;
    const restockCount = amount ? Number(amount) : 1;
    const item = await Vehicle.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    item.quantity += restockCount;
    await item.save();

    res.status(200).json({ message: 'Vehicle restocked successfully', vehicle: item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createVehicle,
  getVehicles,
  searchVehicles,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle,
};
