// server/routes/api.js
const express = require('express');
const router = express.Router();

// Import Controllers
const exerciseController = require('../controllers/exerciseController');
const transactionController = require('../controllers/transactionController');
const dashboardController = require('../controllers/dashboardController');

// 1. Exercise Routes
router.post('/exercises/create', exerciseController.createExercise);
router.get('/exercises', exerciseController.getExercises);

// 2. Transaction Routes
router.post('/submit-answer', transactionController.submitAnswer);
router.get('/user/:address/history', transactionController.getUserHistory); 

// 3. Dashboard Routes
router.get('/dashboard-stats', dashboardController.getStats);
// Thêm các route mới
router.get('/exercise/:exerciseId', exerciseController.buyExercise); // API lấy chi tiết bài thi
router.post('/transaction/log', transactionController.logTransaction); // API lưu log biến động số dư
router.get('/exercise/:exerciseId', exerciseController.buyExercise);
// ...
router.post('/transaction/submit-exam', transactionController.submitExam);
// ...
module.exports = router;