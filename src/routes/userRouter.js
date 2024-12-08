const express = require("express");
const prisma = require("../prismaClient");
const router = express.Router();
const auth = require("../middlewares/auth");

// F8: Edit Customer Data (except for Username and Email)
router.put("/", auth, async (req, res) => {
  const updates = Object.keys(req.body);

  if (updates.length == 0) return res.status(400).json({ message: "no body" });

  const validUpdates = [
    "firstName",
    "lastName",
    "birthDate",
    "gender",
    "city",
    "address", // Optional field
  ];

  const isValid = updates.every((update) => {
    return validUpdates.includes(update);
  });
  if (!isValid) {
    return res.status(400).json({ message: "not valid body" });
  }

  let data = req.body;

  await prisma.user.update({
    where: {
      id: req.user.id,
    },
    data,
  });
  return res.status(200).send({ status: "success" });
});

// F9: View Match Details (including vacant seats)
router.get("/matches/:id", async (req, res) => {
  try {
    const matches = await prisma.match.findFirst({
      where: { id: parseInt(req.params.id) },
      include: {
        seats: {
          where: {
            ticket: {
              is: null, // Filter seats where the ticket is null
            },
          },
        },
      },
    });
    res.status(200).json(matches);
  } catch (error) {
    res.status(500).json({ error: "Error fetching match details" });
  }
});

// F10: Reserve Vacant Seat(s)
router.post("/reserve", auth, async (req, res) => {
  const { matchId, seatNumber, creditCard, pin } = req.body;

  if (!creditCard || !pin) {
    return res.status(400).json({ error: "Credit card and pin required" });
  }

  try {
    // Check if the match exists
    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match || match.vacantSeats <= 0) {
      return res.status(400).json({ error: "No vacant seats available" });
    }

    const seat = await prisma.seat.findFirst({
        where: {
          seatNo: seatNumber,
          ticket: {
            matchId: matchId, // Filter by matchId from the ticket
          },
        },
        include: {
          ticket:{
            select: {
              matchId: true, // Select the matchId from the related ticket
            },
          },
        },
      });
      

    if (seat.ticket != null) {
      return res.status(400).json({ error: "Seat not available" });
    }

    // Update vacant seats count
    await prisma.match.update({
      where: { id: matchId },
      data: { vacantSeats: match.vacantSeats - 1 },
    });

    const ticket = await prisma.ticket.create({
      data: {
        matchId,
        userId: req.user.id,
        seatId: seat.id,
      },
    });

    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ error: "Error reserving the seat" });
  }
});

// F11: Cancel a Reservation (only 3 days before event)
router.delete("/cancel/:ticketId", auth, async (req, res) => {
  const { ticketId } = req.params;

  try {
    // Find reservation
    const ticket = await prisma.ticket.findUnique({
      where: { id: parseInt(ticketId) },
      include: { match: true },
    });

    if (!ticket) {
      return res.status(404).json({ error: "ticket not found" });
    }

    // Check if the reservation can be cancelled (at least 3 days before the match)
    const matchDate = new Date(ticket.match.dateTime);
    const currentDate = new Date();
    const diffDays = Math.ceil((matchDate - currentDate) / (1000 * 3600 * 24));

    if (diffDays < 3) {
      return res
        .status(400)
        .json({ error: "Cannot cancel less than 3 days before the match" });
    }

    // Cancel reservation
    await prisma.ticket.delete({
      where: { id: parseInt(id) },
    });

    // Update vacant seats in match
    await prisma.match.update({
      where: { id: reservation.matchId },
      data: { vacantSeats: reservation.match.vacantSeats + 1 },
    });

    res.status(200).json({ message: "Reservation cancelled successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error cancelling reservation" });
  }
});

module.exports = router;
 