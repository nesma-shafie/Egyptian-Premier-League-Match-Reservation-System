const express = require("express");
const prisma = require("../prismaClient");
const router = express.Router();
const auth = require("../middlewares/auth");

// F8: Edit Customer Data (except for Username and Email)
router.put("/", auth, async(req, res) => {
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
router.get("/matches", async(req, res) => {
    try {
        const matches = await prisma.match.findMany({
            include: {
                homeTeam: true, // Include home team details
                awayTeam: true, // Include away team details
                matchVenue: {
                    include: {
                        seats: {
                            include: {
                                ticket: true, // Include ticket details for reservation check
                            },
                        },
                    },
                },
            },
        });

        // Transform the data
        const matchDetails = matches.map((match) => ({
            id: match.id,
            dateTime: match.dateTime,
            homeTeam: match.homeTeam.name,
            awayTeam: match.awayTeam.name,
            venue: match.matchVenue.name,
            mainReferee: match.mainReferee,
            linesman1: match.linesmen1,
            linesman2: match.linesmen2,
            seats: match.matchVenue.seats.map((seat) => ({
                seatNo: seat.seatNo,
                isReserved: seat.ticket.some((ticket) => ticket.matchId === match.id), // Check if the ticket belongs to this match
            })),
        }));
        //get only match in future
        const new_matches = matchDetails.filter(match => ((match.dateTime) >= new Date()));

        res.status(200).json(new_matches);
    } catch (error) {
        res.status(500).json({ error: "Error fetching match details" });
    }
});

router.get("/matches/:id", auth, async(req, res) => {
    const { id } = req.params;
    try {
        const match = await prisma.match.findUnique({
            where: { id: parseInt(id) },
            include: {
                homeTeam: true, // Include home team details
                awayTeam: true, // Include away team details
                matchVenue: {
                    include: {
                        seats: {
                            include: {
                                ticket: true, // Include ticket details for reservation check
                            },
                        },
                    },
                },
            },
        });

        // Transform the data
        const matchDetails = {
            id: match.id,
            dateTime: match.dateTime,
            homeTeam: match.homeTeam.name,
            awayTeam: match.awayTeam.name,
            venue: match.matchVenue.name,
            mainReferee: match.mainReferee,
            linesman1: match.linesmen1,
            linesman2: match.linesmen2,
            seats: match.matchVenue.seats.map((seat) => ({
                seatNo: seat.seatNo,
                isReserved: seat.ticket.some((ticket) => ticket.matchId === match.id), // Check if the ticket belongs to this match
                byMe: seat.ticket.some((ticket) => ticket.userId === req.user.id) // Check if the ticket belongs to the current user
            })),
        };
        res.status(200).json(matchDetails);
    } catch (error) {
        console.log(error);

        res.status(500).json({ error: "Error fetching match details" });
    }
});

// F10: Reserve Vacant Seat(s)
router.post("/reserve", auth, async(req, res) => {
    const { matchId, seatNumber, creditCard, pin } = req.body;

    if (!creditCard || !pin) {
        return res.status(400).json({ error: "Credit card and pin required" });
    }

    try {
        // Check if the match exists
        const match = await prisma.match.findFirst({
            where: { id: matchId },
        });

        if (!match || match.vacantSeats <= 0) {
            return res.status(400).json({ error: "No vacant seats available" });
        }

        const seat = await prisma.seat.findFirst({
            where: {
                seatNo: seatNumber,
                stadiumId: match.matchVenueId,
                ticket: {
                    none: { // Use 'none' to filter for seats with no associated tickets
                        matchId: matchId, // Optional: filter by matchId if needed
                    },
                },
            },
            include: {
                ticket: {
                    select: {
                        matchId: true, // Select the matchId from the related ticket, if any
                    },
                },
            },
        });



        if (seat == null) {
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
        res.status(500).json({ error: error });
    }
});

// F11: Cancel a Reservation (only 3 days before event)
router.post("/cancel", auth, async(req, res) => {
    const {
        matchId,
        seatNo
    } = req.body;
    try {
        // Find reservation

        const ticket = await prisma.ticket.findFirst({
            where: { matchId: matchId, userId: req.user.id, seat: { seatNo: seatNo } },
            include: { match: true },
        });
        if (!ticket) {
            return res.status(404).json({ error: "ticket not found" });
        }

        // Check if the reservation can be cancelled (at least 3 days before the match)
        const matchDate = new Date(ticket.match.dateTime);
        console.log(matchDate);
        const currentDate = new Date();
        const diffDays = Math.ceil((matchDate - currentDate) / (1000 * 3600 * 24));
        if (diffDays < 3) {
            return res
                .status(400)
                .json({ error: "Cannot cancel less than 3 days before the match" });
        }

        // Cancel reservation
        await prisma.ticket.delete({
            where: { id: parseInt(ticket.id) },
        });

        // Update vacant seats in match
        await prisma.match.update({
            where: { id: ticket.matchId },
            data: { vacantSeats: ticket.match.vacantSeats + 1 },
        });

        res.status(200).json({ message: "Reservation cancelled successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error cancelling reservation" });
    }
});

//get user details
router.get("/", auth, async(req, res) => {
    const user = await prisma.user.findFirst({
            where: {
                id: req.user.id,
            },
            select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                birthDate: true,
                role: true,
                address: true,
                city: true,
                email: true,
                gender: true,
            }
        }

    )


    res.status(200).json({ "user": user });
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
});

router.get("/tickets", auth, async(req, res) => {
    const tickets = await prisma.ticket.findMany({
        where: {
            userId: req.user.id,
        },
        include: {
            match: {
                include: {
                    homeTeam: true,
                    awayTeam: true,
                    matchVenue: true,
                },
            },
            seat: {
                include: {
                    stadium: true,
                },
            },
        },
    });

    res.status(200).json(tickets);
})
module.exports = router;