const express = require("express");
const prisma = require("../prismaClient");
const router = express.Router();
const managerAuth = require("../middlewares/managerAuth");

// F3: Create a New Match Event
router.post("/matches", managerAuth, async (req, res) => {
  const {
    homeTeamName,
    awayTeamName,
    matchVenueName,
    dateTime,
    mainReferee,
    linesmen1,
    linesmen2,
  } = req.body;
  try {
    const match = await prisma.match.create({
      data: {
        homeTeam: {
          connect: { name: homeTeamName }, // Connect to an existing home team by name
        },
        awayTeam: {
          connect: { name: awayTeamName }, // Connect to an existing away team by name
        },
        matchVenue: {
          connect: { name: matchVenueName }, // Connect to an existing stadium by name
        },
        dateTime: dateTime ? new Date(dateTime) : undefined,
        mainReferee,
        linesmen1,
        linesmen2,
      },
      include: {
        homeTeam: true,
        awayTeam: true,
        matchVenue: true,
      },
    });

    res
      .status(201)
      .json({ message: "Match event created successfully", match });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the match event." });
  }
});

// F4: Edit the Details of an Existing Match
router.put("/matches/:id", managerAuth, async (req, res) => {
  const { id } = req.params;
  const updates = Object.keys(req.body);

  if (updates.length === 0) {
    return res
      .status(400)
      .json({ message: "No data provided in request body" });
  }

  const validUpdates = [
    "homeTeamName",
    "awayTeamName",
    "matchVenueName",
    "dateTime",
    "mainReferee",
    "linesmen1",
    "linesmen2",
  ];

  const isValid = updates.every((update) => validUpdates.includes(update));

  if (!isValid) {
    return res.status(400).json({ message: "Invalid fields in request body" });
  }

  const data = req.body;
  try {
    const updatedMatch = await prisma.match.update({
      where: {
        id: parseInt(id), // Ensure `id` is parsed to an integer
      },
      data,
      include: {
        homeTeam: true,
        awayTeam: true,
        matchVenue: true,
      },
    });

    res.status(200).json({
      message: "Match details updated successfully",
      match: updatedMatch,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Match not found or one of the entities does not exist.",
      });
    }
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the match details." });
  }
});

// F5 add new stadiums
router.post("/stadium", managerAuth, async (req, res) => {
  const { name, numberOfSeats } = req.body;

  // Validate the input
  if (!numberOfSeats || numberOfSeats <= 0) {
    return res.status(400).json({ error: "Invalid number of seats" });
  }

  try {
    // Check if the stadium already exists
    const existingStadium = await prisma.stadium.findUnique({
      where: { name },
    });

    if (existingStadium) {
      return res.status(400).json({ error: "Stadium already exists" });
    }

    // Create the new stadium
    const stadium = await prisma.stadium.create({
      data: { name },
    });

    // Create the seats for the new stadium
    const seatsData = Array.from({ length: numberOfSeats }, (_, index) => ({
      seatNo: index + 1,
      stadiumId: stadium.id, // Associate seat with the created stadium
    }));

    // Bulk create the seats
    const seats = await prisma.seat.createMany({
      data: seatsData,
    });

    // Respond with the created stadium and seats
    res.status(201).json({
      message: "Stadium and seats added successfully",
      stadium,
      seats,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the stadium and seats." });
  }
});

// F7: View vacant/reserved seats for each match.
router.get("/matches/:id/seats", managerAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      select: {
        matchVenue: {
          select: {
            seats: {
              include: {
                ticket: true,
              },
            },
          },
        },
      },
    });
    if (!match) {
      return res.status(404).json({ error: "Match not found" });
    }

    const vacantseats = match.matchVenue.seats.filter(
      (seat) => seat.ticket == null
    );
    const reservedseats = match.matchVenue.seats.filter(
      (seat) => seat.ticket != null
    );

    const reservedSeatNumbers = reservedseats.map((seat) => seat.seatNo);
    const reserved = reservedseats.length;
    const vacantSeatNumbers = vacantseats.map((seat) => seat.seatNo);
    const vacant = vacantseats.length;

    res.status(200).json({
      matchId: id,
      numberOfReservedSeats: reserved,
      numberOfVacantSeats: vacant,
      reservedSeats: reservedSeatNumbers,
      vacantSeats: vacantSeatNumbers,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving seat status." });
  }
});

// Export the router
module.exports = router;
