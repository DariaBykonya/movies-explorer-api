const { rateLimit } = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // максимальное число запросов с одного IP
  message: 'Превышен лимит запросов с вашего IP. Попробуйте позже.',
});

module.exports = limiter;
