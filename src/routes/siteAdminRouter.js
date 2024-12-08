const express = require("express");
const prisma = require("../prismaClient");
const router = express.Router();
const adminAuth = require("../middlewares/adminAuth");

router.delete('/users/:id', adminAuth, async (req, res) => {
    const { id } = req.params;
  
    try {
      // Check if the user exists
      const userToDelete = await prisma.user.findUnique({
        where: { id: parseInt(id) },
      });
  
      if (!userToDelete) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Delete the user
      await prisma.user.delete({
        where: { id: parseInt(id) },
      });
  
      res.status(200).json({ message: 'User account deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while deleting the user account' });
    }
  });

  module.exports = router;
  

