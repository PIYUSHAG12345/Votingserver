const express = require('express');
const router = express.Router();
const { ethers } = require('ethers');
const jwt = require('jsonwebtoken');

router.post('/authentication', async (req, res) => {
  try {
    const { accountAddress } = req.query;
    const { signature } = req.body;
    console.log('Account Address:', accountAddress);
    
    // Ensure both `accountAddress` and `signature` are provided
    if (!signature || !accountAddress) {
      return res.status(400).json({ message: "Authentication Failed: Missing signature or account address" });
    }
    
    const message = "Welcome to Voting Dapp. You accept our terms and condition";
    const recoveredAddress = ethers.utils.verifyMessage(message, signature);

    // Compare recovered address directly with `accountAddress`
    if (recoveredAddress.toLowerCase() === accountAddress.toLowerCase()) {
      const token = jwt.sign({ accountAddress }, 'secretKey');
      return res.status(200).json({ message: "Authentication Successful", token: token });
    } else {
      throw new Error("Recovered address does not match account address");
    }
    
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ message: "Authentication failed" });
  }
});

module.exports = router;
