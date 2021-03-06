exports.render = function(req, res) {
  if (req.session.lastVisit) {
    console.log(req.session.lastVisit);
  }

  req.session.lastVisit = new Date();
  res.render('pages/landing', {
    userFullName: req.user ? req.user.fullName : '',
    email: req.user ? req.user.username : ''
  });
};
