const dns = require("dns");

dns.resolveSrv(
  "_mongodb._tcp.cluster0.ci35dr5.mongodb.net",
  (err, records) => {
    console.log(err);
    console.log(records);
  }
);