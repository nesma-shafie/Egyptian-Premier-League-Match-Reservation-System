const express = require("express");
const prisma = require("../prismaClient");
const router = express.Router();
const adminAuth = require("../middlewares/adminAuth");

router.delete('/users/:id', adminAuth, async(req, res) => {
    const { id } = req.params;
    // console.log("id", id)
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
//get all users
router.get('/users', adminAuth, async(req, res) => {
        try {
            const users = await prisma.user.findMany(
                //where type not equal SiteAdministrator
                {
                    where: {
                        NOT: {
                            role: 'SiteAdministrator'
                        }
                    }
                }
            );
            res.status(200).json({ users });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while fetching users' });
        }


    })
    //approve user
router.post('/users/approve_user/:id', adminAuth, async(req, res) => {
    const { id } = req.params;
    console.log("userId", id)
    try {
        // Check if the user exists
        const userToApprove = await prisma.not_approved_User.findFirst({
            where: { id: parseInt(id) },
        });

        if (!userToApprove) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Create the new user in the database
        const newUser = await prisma.user.create({
            data: {
                username: userToApprove.username,
                password: userToApprove.password,
                firstName: userToApprove.firstName,
                birthDate: userToApprove.birthDate,
                lastName: userToApprove.lastName,
                address: userToApprove.address,
                city: userToApprove.city,
                email: userToApprove.email,
                role: userToApprove.role,
                gender: userToApprove.gender,
            }

        });
        await prisma.not_approved_User.delete({
            where: { id: parseInt(id) },
        });
        res.status(200).json({ message: 'User approved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while approving the user' });
    }
});



router.get('/not_approved_users', adminAuth, async(req, res) => {
    try {
        const users = await prisma.not_approved_User.findMany(
            //where type not equal SiteAdministrator
            {
                where: {
                    NOT: {
                        role: 'SiteAdministrator'
                    }
                }
            }
        );
        res.status(200).json({ users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching users' });
    }


})

//create new efa manager or site admin
router.post('/users/create', adminAuth, async(req, res) => {
    const {
        username,
        password,
        firstName,
        lastName,
        birthDate,
        address,
        city,
        email,
        role,
    } = req.body;
    console.log("body", req.body)
    try {
        // Create the new user in the database
        const newUser = await prisma.user.create({
            data: {
                username: username,
                password: password,
                firstName: firstName,
                birthDate: birthDate,
                lastName: lastName,
                address: address,
                city: city,
                email: email,
                role: role, // SiteAdministrator or EfaManager                                                                              
            }
        }); // Return the new user
        res.status(201).json({ newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating the user' });
    }

});
module.exports = router;