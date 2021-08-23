const express = require("express");
const axios = require("axios");
const router = express.Router();
const Plan = require("../models/Plan");
const User = require("../models/User");

const { calculateNextPayment } = require("../Helper");
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

var payments = [];

async function pay(dur) {
  if (dur === "weekly") {
    var pamount = 10000;
    var pdescription = "خرید اشتراک هفتگی";
  } else if (dur === "monthly") {
    var pamount = 12000;
    var pdescription = "خرید اشتراک ماهانه";
  }
  try {
    const res = await axios({
      method: "post",
      url: "https://api.zarinpal.com/pg/v4/payment/request.json",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        merchant_id: "d5556ac2-16ba-11e9-8272-005056a205be",
        amount: pamount,
        callback_url: "http://localhost:5000/plans/pay",
        description: pdescription,
        metadata: { mobile: "09365848189", email: "obonakdar2@gmail.com" },
      }),
    });
    console.log(res.data.data);
    if (res.data.data.code === 100) {
      payments.push({
        type: dur,
        authority: res.data.data.authority,
        amount: pamount,
        description: pdescription,
      });
      console.log("before Time situation: ", payments);
      setTimeout(function () {
        payments.splice(
          payments.findIndex((payment) => {
            return payment.authority == res.data.data.authority;
          }),
          1
        );
        console.log("Time situation: ", payments);
      }, 120000);
      const newURL =
        "https://www.zarinpal.com/pg/StartPay/" + res.data.data.authority;
      return newURL;
    }
  } catch (e) {
    console.log("fetch failed", e);
  }
}

// Plans Page
router.get("/", ensureAuthenticated, (req, res) => {
  res.render("plans");
});

router.post("/", async (req, res) => {
  const { duration } = req.body;
  if (duration == "weekly") {
    const newURL = await pay("weekly");
    res.render("lead", { newURL });
  } else if (duration === "monthly") {
    const newURL = await pay("monthly");
    res.render("lead", { newURL });
  }
});

router.get("/pay", ensureAuthenticated, async (req, res) => {
  if (req.query.Status === "OK") {
    try {
      // find current payment from payments array
      var p = payments.find((payment) => {
        return payment.authority == req.query.Authority;
      });
      function info() {
        return (infos = {
          amount: p.amount,
          type: p.type,
        });
      }

      // verify payment
      const verify = await axios({
        method: "post",
        url: "https://api.zarinpal.com/pg/v4/payment/verify.json",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          merchant_id: "d5556ac2-16ba-11e9-8272-005056a205be",
          amount: info().amount,
          authority: req.query.Authority,
        }),
      });
      res.status(200).render("paysuccess", {
        ref_id: verify.data.data.ref_id,
      });
      if (verify.data.data.code == 100 || verify.data.data.code == 101) {
        let nextpaymentDate;
        let date = Date.now();
        nextpaymentDate = await calculateNextPayment(info().type, date);
        req.user.is_paid = true;
        req.user.next_payment_date = nextpaymentDate;
        req.user.save();
      }
    } catch (e) {
      res.status(400).send(e);
    }
  } else if (req.query.Status === "NOK") {
    try {
      res.status(200).render("payfail");
    } catch (e) {
      res.status(400).send(e);
    }
  }
});

module.exports = router;
