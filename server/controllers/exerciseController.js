const Exercise = require('../models/Exercise');
const { uploadToPinata } = require('../utils/pinata');
const axios = require('axios');
require('dotenv').config();

// --- 1. ĐĂNG BÀI (CREATE) ---
exports.createExercise = async (req, res) => {
  try {
    // SỬA: Nhận 'questions' (mảng) và 'title' thay vì 'question_content' đơn lẻ
    const { creator_address, topic, title, questions, price, tx_hash } = req.body;

    console.log(`📩 [Gemini 2.0] Đang duyệt bài thi: "${title}" gồm ${questions.length} câu...`);

    const API_KEY = process.env.GEMINI_API_KEY;
    const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    // SỬA PROMPT: Đưa cả danh sách câu hỏi vào để AI duyệt một thể
    const prompt = `
      You are a strict Quality Assurance AI for an English Exam Platform.
      Analyze the list of questions below and return a JSON object ONLY.
      
      Input Data:
      - Topic: "${topic}"
      - Exam Title: "${title}"
      - Questions List: ${JSON.stringify(questions)}

      CRITERIA FOR APPROVAL ("approved": true):
      1. ALL questions must be SAFE (No violence, sexual, hate speech).
      2. ALL questions must be VALID ENGLISH.
      3. No SPOILERS in the content (No '✅' marks in question text).

      OUTPUT FORMAT (JSON ONLY):
      { "approved": boolean, "reason": "string (in Vietnamese)" }
    `;

    const response = await axios.post(URL, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { response_mime_type: "application/json" }
    }, { headers: { 'Content-Type': 'application/json' } });

    const aiText = response.data.candidates[0].content.parts[0].text;
    let aiResult;
    try {
        const cleanJson = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
        aiResult = JSON.parse(cleanJson);
    } catch (e) {
        console.error("AI Parse Error:", e);
        // Fallback nếu AI trả lời lỗi format
        aiResult = { approved: false, reason: "Lỗi định dạng AI, vui lòng thử lại." };
    }

    if (!aiResult.approved) {
        return res.json({ success: false, message: `AI TỪ CHỐI: ${aiResult.reason}` });
    }

    // Nếu OK -> Upload & Lưu
    console.log("✅ AI Duyệt OK. Đang upload IPFS...");
    
    // Upload object chứa toàn bộ đề thi
    const ipfsHash = await uploadToPinata({
        title, topic, questions, creator: creator_address
    });

    const newExercise = new Exercise({
        creator_address,
        title,
        topic,
        questions, // Lưu nguyên mảng câu hỏi
        price,
        ipfs_hash: ipfsHash,
        status: 'active',
        ai_validation: { status: 'approved', reason: aiResult.reason }
    });

    await newExercise.save();

    res.json({ success: true, message: 'Đăng bài thành công!', ipfs_hash: ipfsHash });

  } catch (error) {
    console.error("❌ Lỗi Server:", error);
    res.json({ success: false, message: `Lỗi hệ thống: ${error.message}` });
  }
};

// --- 2. LẤY DANH SÁCH (GET LIST) ---
exports.getExercises = async (req, res) => {
    // Chỉ trả về các trường cần thiết để hiển thị ngoài chợ
    const list = await Exercise.find({ status: 'active' })
        .select('title topic price creator_address createdAt questions') // Lấy questions để đếm số lượng câu
        .sort({ createdAt: -1 });
    res.json(list);
};

// --- 3. MUA BÀI THI (BUY EXERCISE) ---
exports.buyExercise = async (req, res) => {
    try {
        const { exerciseId } = req.params;
        const exercise = await Exercise.findById(exerciseId);
        
        if (!exercise) {
            return res.status(404).json({ error: "Bài tập không tồn tại" });
        }
        
        res.json(exercise);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};