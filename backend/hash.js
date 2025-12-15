const bcrypt = require("bcryptjs");

(async () => {
  const password = "admin123"; // you can change this
  const hash = await bcrypt.hash(password, 10);
  console.log(hash);
})();
