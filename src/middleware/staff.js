/**
 * @module Staff 
 * @description Staff middleware.
 */ 

function staff(req, res, next){
  console.log('Staff Middleware');
  console.log(req.user);
  console.log(req.user.user.role);
  role = req.user.user.role;
  if (role === 'customer' || role === undefined ){
    console.log('Access denied');
    return res.status(403).json({ msg: 'Access denied'});
  }
  next();
}

module.exports = staff;