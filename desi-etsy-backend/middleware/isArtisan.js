module.exports = function (req, res, next) {
  // Only allow if user is artisan and verified
  if (!req.user || req.user.role !== 'artisan' || !req.user.isVerified) {
    return res.status(403).json({ message: 'Access denied. Artisan account not verified by admin.' });
  }
  next();
}; 