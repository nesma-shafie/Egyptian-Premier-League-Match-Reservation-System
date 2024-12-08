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
  if (!homeTeamName || !awayTeamName || !matchVenueName || !dateTime || !mainReferee || !linesmen1 || !linesmen2) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const homeTeam = await prisma.team.findUnique({ where: { name: homeTeamName } });
    const awayTeam = await prisma.team.findUnique({ where: { name: awayTeamName } });
    const matchVenue = await prisma.stadium.findUnique({
      where: { name: matchVenueName },
      include: { seats: true }, // Include seats to get the count
    });
  
  
    // Check if any of the teams or venue doesn't exist
    if (!homeTeam || !awayTeam || !matchVenue) {
      return res.status(400).json({ error: "One or more teams or venues not found" });
    }
  
    const vacantSeats = matchVenue.seats.length;
    // Create the match if all references are valid
    const match = await prisma.match.create({
      data: {
        homeTeamId: homeTeam.id, // Use the id from the found home team
        awayTeamId: awayTeam.id, // Use the id from the found away team
        matchVenueId: matchVenue.id, // Use the id from the found match venue
        dateTime: new Date(dateTime),
        mainReferee,
        linesmen1,
        linesmen2,
        vacantSeats
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

  
  try {
    const data = req.body;
    const updateData = {};
  if (data.homeTeamName) {
    updateData.homeTeam = { connect: { name: data.homeTeamName } };
  }
  if (data.awayTeamName) {
    updateData.awayTeam = { connect: { name: data.awayTeamName } };
  }
  if (data.matchVenueName) {
    updateData.matchVenue = { connect: { name: data.matchVenueName } };
  }
  if (data.mainReferee) {
    updateData.mainReferee = data.mainReferee;
  }
  if (data.dateTime) {
    updateData.dateTime = new Date(data.dateTime);
  }
  if (data.linesmen1) {
    updateData.linesmen1 = data.linesmen1;
  }
  if (data.linesmen2) {
    updateData.linesmen2 = data.linesmen2;
  }
  
    const updatedMatch = await prisma.match.update({
      where: {
        id: parseInt(id), // Ensure `id` is parsed to an integer
      },
      data:updateData,
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
    const match = await prisma.match.findFirst({
      where: { id: parseInt(id) },
      select: {
        matchVenue: {
          select: {
            seats: {
              select: {
                seatNo: true,
                ticket: true, // Include the ticket relation to check if it's reserved or not
              },
            },
          },
        },
      },
    });
    
    if (!match) {
      return res.status(404).json({ error: "Match not found" });
    }
    
   
    // Separate the seats into vacant and reserved
    const vacantSeats = match.matchVenue.seats.filter((seat) => seat.ticket.every((ticket) => ticket.matchId != parseInt(id)));
    const reservedSeats = match.matchVenue.seats.filter((seat) =>seat.ticket.some((ticket) => ticket.matchId === parseInt(id) ));
    
    // Extract seat numbers
    const reservedSeatNumbers = reservedSeats.map((seat) => seat.seatNo);
    const vacantSeatNumbers = vacantSeats.map((seat) => seat.seatNo);
    
    // Get counts
    const reservedCount = reservedSeats.length;
    const vacantCount = vacantSeats.length;
    
   
    res.status(200).json({
      matchId: id,
      reservedSeatNumbers,
      vacantSeatNumbers,
      reservedCount,
      vacantCount,
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
