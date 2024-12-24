import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Not Authorised. Login Again' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token after 'Bearer '

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        if (tokenDecode.id) {
            req.body.userId = tokenDecode.id; // Attach userId to the request body
        } else {
            return res.status(401).json({ success: false, message: 'Not Authorised. Login Again' });
        }
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: error.message });
    }
};

export default userAuth;
