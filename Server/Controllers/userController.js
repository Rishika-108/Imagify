import userModel from "../Model/userData.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Stripe from 'stripe';
import transactionModel from "../Model/transactionModel.js";

const stripe = new Stripe(process.env.SECRET_KEY);

// Register User
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const userData = { name, email, password: hashedPassword };

        const newUser = new userModel(userData);
        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ success: true, token, user: { name: user.name } });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Handle Login User
const loginUser = async (req,res) => {
    try {
        const {email, password} = req.body;
        const user = await userModel.findOne({email})
        if (!user) {
            return res.json({
                success : false, message : 'User does not exist'
               }) 
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
            res.json({success : true, token, user : {name : user.name}})

        } else {
            return res.json({
                success : false, message : 'Invalid Creditials'
               }) 
        }
    } catch (error) {
        console.log (error);
        res.json ({success : false, message : error.message})
    }
}
const userCredits = async (req, res) => {
    try {
        const { userId } = req.body;

        // Ensure userId is provided
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required." });
        }

        // Fetch user by ID
        const user = await userModel.findById(userId);

        // Check if user exists
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // Return user credits and name
        res.json({
            success: true,
            credits: user.creditBalance || 0, // Default to 0 if creditBalance is undefined
            user: { name: user.name }
        });
    } catch (error) {
        console.error("Error fetching user credits:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};


// Handle Payment and Add Credits
const frontend_url = "http://localhost:5173"; // Update your frontend URL if needed

const createCheckoutSession = async (req, res) => {
    try {
        const { userId, planId } = req.body;
        if (!userId || !planId) {
            return res.status(400).json({ success: false, message: 'Missing Details' });
        }

        // Define plans and associated amounts and credits
        const plans = {
            Basic: { credits: 100, amount: 50 },
            Advanced: { credits: 500, amount: 70 },
            Business: { credits: 5000, amount: 250 },
        };

        const selectedPlan = plans[planId];
        if (!selectedPlan) {
            return res.status(400).json({ success: false, message: 'Invalid Plan' });
        }

        const { credits, amount } = selectedPlan;

        // Create transaction in the database
        const transaction = await transactionModel.create({
            userId,
            plan: planId,
            amount,
            credits,
            date: Date.now(),
            payment: false,
        });

        // Create line items for the Stripe Checkout session
        const line_items = [
            {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: `${planId} Plan`,
                    },
                    unit_amount: amount * 100, // Amount in the smallest unit (paise for INR)
                },
                quantity: 1,
            },
        ];

        // Create Stripe Checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${frontend_url}/verify?success=false`,            
            metadata: {
                transactionId: String(transaction._id), // Attach transaction ID to metadata
            },
        });

        // Return the session URL to the frontend to redirect user to Stripe's payment page
        res.status(200).json({
            success: true,
            sessionUrl: session.url, // The URL to redirect to the Stripe Checkout page
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};


// Verify Payment and Add Credits
const verifyPayment = async (req, res) => {
    try {
        const { sessionId } = req.body;  // Receive the session ID from frontend
        if (!sessionId) {
            return res.json({ success: false, message: 'Missing Session ID' });
        }

        // Retrieve the session from Stripe Checkout using session ID
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            const transactionId = session.metadata.transactionId; // Retrieve transaction ID from metadata
            const transaction = await transactionModel.findById(transactionId);

            if (!transaction) {
                return res.json({ success: false, message: 'Transaction not found' });
            }

            if (transaction.payment) {
                return res.json({ success: true, message: 'Payment already processed' });
            }

            // Update user's credits and mark transaction as paid
            const user = await userModel.findById(transaction.userId);
            if (!user) {
                return res.json({ success: false, message: 'User not found' });
            }

            user.creditBalance = (user.creditBalance || 0) + transaction.credits;  // Add credits to the user's account
            await user.save();

            transaction.payment = true;  // Mark the transaction as paid
            await transaction.save();

            res.json({ success: true, message: 'Payment successful, credits added' });
        } else {
            res.json({ success: false, message: 'Payment not successful' });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export {loginUser, registerUser, createCheckoutSession, verifyPayment,userCredits };
