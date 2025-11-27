const axios = require('axios');
require('dotenv').config();

const uploadToPinata = async (jsonData) => {
    try {
        const data = JSON.stringify({
            pinataOptions: { cidVersion: 1 },
            pinataMetadata: { name: `Exercise_${Date.now()}` },
            pinataContent: jsonData
        });

        const config = {
            method: 'post',
            url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
            headers: { 
                'Authorization': `Bearer ${process.env.PINATA_JWT}`,
                'Content-Type': 'application/json'
            },
            data: data
        };

        const res = await axios(config);
        return res.data.IpfsHash;
    } catch (error) {
        console.error("❌ Pinata Error:", error);
        throw new Error("Failed to upload to IPFS");
    }
};

module.exports = { uploadToPinata };