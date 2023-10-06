const { PrismaClient } = require("@prisma/client");
const responses = require("../utility/response");
const {uploadMedia} = require('../utility/AWSUtils');
const prisma = require('../utility/prismaClient');
const Razorpay = require('razorpay');
require('dotenv').config();
const crypto = require('crypto');

// Create a new instance of Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

const fetchPaymentDetails = async (razorpay_payment_id) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_API_KEY,
      key_secret: process.env.RAZORPAY_SECRET_KEY,
    });

    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    return payment;
  } catch (error) {
    console.error('Error fetching payment details:', error);
    throw error;
  }
};

module.exports.createTransactionOrder = async (req, res, next) => {
  try {
    const { amount, currency, userId, designIds } = req.body;

    // Use Razorpay for payment processing
    const options = {
      amount: amount * 100, // Amount in paise or smallest currency unit
      currency,
      receipt: 'unique_receipt_id', // Unique identifier for the transaction
      payment_capture: 1, // Auto-capture the payment after successful authorization
    };

    const payment = await razorpay.orders.create(options);

    // Store the Razorpay response data in the TransactionOrder model
    const transactionOrder = await prisma.transactionOrder.create({
      data: {
        amount,
        currency,
        user: { connect: { id: userId } }, // Connect the user who made the payment
        designs: {
          connect: designIds.map((designId) => ({ id: designId })),
        },
        orderId: payment.id,
        entity: payment.entity,
        amountPaid: payment.amount_paid,
        amountDue: payment.amount_due,
        receipt: payment.receipt,
        offerId: payment.offer_id,
        paymentStatus: payment.status,
        attempts: payment.attempts,
        notes: payment.notes,
        createdAtRazor: new Date(payment.created_at * 1000),
      },
    });

    // Include the transactionOrder in the response
    res.status(201).json({ success: true, transactionOrder });
  } catch (error) {
    console.error('Error creating transaction order:', error);
    res.status(500).json({ success: false, message: 'Failed to create transaction order.' });
  }
};

module.exports.getTransactionOrder = async (req, res, next) => {
  BigInt.prototype.toJSON = function () {
    return this.toString();
  };
  try {
    const { id } = req.query;
    let whereCondition = {};
    if (id) {
      whereCondition = { id: parseInt(id) };
    }
    const transactionOrders = await prisma.transactionOrder.findMany({
      where: whereCondition,
      include: {
        user: true, // Include user data
        designs: true, // Include designs data
        _count: true, // Include the count of related records
      },
    });
    if (!transactionOrders) {
      return res.status(404).json({ success: false, message: 'Transaction Order not found.' });
    }
    res.status(200).json({ success: true, transactionOrders });
  } catch (error) {
    console.error('Error retrieving Transaction Order:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve Transaction Order.' });
  }
};

module.exports.verifyPayment = async (req, res, next) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

  const signature = razorpay_order_id + '|' + razorpay_payment_id;

  try {
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET_KEY);
    hmac.update(signature);

    const expectedSignature = hmac.digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Payment is valid

      // Fetch payment details using paymentId
      const paymentDetails = await fetchPaymentDetails(razorpay_payment_id);

      // Save payment details in the TransactionDetails model
      const createdTransactionDetails = await prisma.transactionDetails.create({
        data: {
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature,
          amount: paymentDetails.amount,
          currency: paymentDetails.currency,
          status: paymentDetails.status,
          order_id: paymentDetails.order_id,
          card_id: paymentDetails.card?.id || null,
          email: paymentDetails.email,
          contact: paymentDetails.contact,
          card: paymentDetails.card ? JSON.stringify(paymentDetails.card) : null,
          amount_refunded: paymentDetails.amount_refunded,
          refund_status: paymentDetails.refund_status,
          captured: paymentDetails.captured,
          description: paymentDetails.description,
          bank: paymentDetails.bank,
          wallet: paymentDetails.wallet,
          vpa: paymentDetails.vpa,
          token_id: paymentDetails.token_id,
          notes: paymentDetails.notes ? JSON.stringify(paymentDetails.notes) : null,
          fee: paymentDetails.fee,
          tax: paymentDetails.tax,
          error_code: paymentDetails.error_code,
          error_description: paymentDetails.error_description,
          error_source: paymentDetails.error_source,
          error_step: paymentDetails.error_step,
          error_reason: paymentDetails.error_reason,
          acquirer_data: paymentDetails.acquirer_data ? JSON.stringify(paymentDetails.acquirer_data) : null,
        },
      });

      res.status(200).json({ success: true, message: 'Payment verified successfully.', transactionDetails: createdTransactionDetails });
    } else {
      // Invalid payment
      res.status(400).json({ success: false, message: 'Invalid payment.' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, message: 'Failed to verify payment.' });
  }
};