const moment = require("moment");

module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "Please log in to view that resource");
    res.redirect("/users/login");
  },
  ensurePaid: function (req, res, next) {
    if (req.isAuthenticated()) {
      let today_date = moment(new Date()).format("YYYY-MM-DD hh:mm");
      let userDueDate = moment(req.user.next_payment_date).format(
        "YYYY-MM-DD hh:mm"
      );
      if (today_date >= userDueDate) {
        req.user.is_paid = false;
        req.user.save();
      }
      if (req.user.is_paid == true) {
        return next();
      } else if (req.user.is_paid == false) {
        req.flash("error_msg", "شما هیچ اشتراک فعالی ندارید");
        return res.redirect("/plans");
      }
    }
    //skip authentication
    // return next();
    req.flash("error_msg", "Please log in to view that resource");
    res.redirect("/users/login");
  },
  forwardAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect("/dashboard");
  },
};
