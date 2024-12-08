const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Create users with roles
  const roles = ["USER", "EFAManager", "SiteAdministrator"];
  const users = [];
  for (let i = 0; i < roles.length; i++) {
    const user = await prisma.user.create({
      data: {
        username: `user${i + 1}`,
        password: "hashedpassword", // Replace with a hashed password
        firstName: `FirstName${i + 1}`,
        lastName: `LastName${i + 1}`,
        birthDate: new Date(1990 + i, 1, 1),
        gender: "MALE",
        city: "City",
        address: "Address",
        email: `user${i + 1}@example.com`,
        role: roles[i],
      },
    });
    users.push(user);
  }

  // Create 4 stadiums with 50 seats each
  const stadiums = [];
  for (let i = 1; i <= 4; i++) {
    const stadium = await prisma.stadium.create({
      data: {
        name: `Stadium${i}`,
      },
    });

    for (let j = 1; j <= 50; j++) {
      await prisma.seat.create({
        data: {
          seatNo: j,
          stadiumId: stadium.id,
        },
      });
    }

    stadiums.push(stadium);
  }

  // Create 10 matches
  for (let i = 1; i <= 10; i++) {
    await prisma.match.create({
      data: {
        homeTeam: {
          create: {
            name: `Team${i * 2 - 1}`,
          },
        },
        awayTeam: {
          create: {
            name: `Team${i * 2}`,
          },
        },
        matchVenueId: stadiums[i % 4].id, // Rotate through stadiums
        dateTime: new Date(2024, i, i + 1, 19, 0, 0),
        mainReferee: `Referee${i}`,
        linesmen1: `Linesman1-${i}`,
        linesmen2: `Linesman2-${i}`,
        vacantSeats: 50,
      },
    });
  }

  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
