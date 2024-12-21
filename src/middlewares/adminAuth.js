const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
const adminAuth = async(req, res, next) => {
    let token = null;
    if (req.header("Authorization")) {
        token = req.header("Authorization").replace("Bearer ", "");
    } else {
        return res.status(401).json({ message: "No token provided" });
    }

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    let decode = null;
    try {
        decode = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return res.status(401).json({ message: "token not valid" });
    }
    // 1) get user id
    const userId = parseInt(decode.id, 10);
    // 2) check user existance
    const user = await prisma.user.findFirst({
        where: { id: userId },

    });

    if (!user) return res.status(404).json({ message: "user not found" });
    if (user.role != "SiteAdministrator") return res.status(409).json({ message: "no authority" });

    req.user = user;
    next();
};

module.exports = adminAuth;