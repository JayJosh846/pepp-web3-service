const { createHmac } = require('crypto');
const { checksumSecret } = require('../../config');
module.exports = (req, res, next) => {
  try {
    const hash = req.headers['x-checksum'];
    const payload = [req.body || '', req.params || '', req.query || ''].filter(obj => Object.keys(obj).length);
    const message = payload.map(data => data.toString()).join('');
    const checksum = createHmac('sha256', checksumSecret).update(message).digest('hex');
    if(!hash) {
      return res.status(400).json({
        status: false,
        message: 'Checksum header missing.'
      });
    }
    if(hash !== checksum) {
      return res.status(400).json({
        status: false,
        message: 'Invalid request checksum.'
      });
    }

    next();
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      status: false,
      message: 'Server Error: Checksum Validation Failed.'
    });
  }
}