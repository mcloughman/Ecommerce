const fs = require("fs");
const crypto = require("crypto");
const util = require("util");
const Repository = require("./repository");
const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository {
  async create(attributes) {
    attributes.id = this.randomId();

    const salt = crypto.randomBytes(8).toString("hex");

    // crypto.scrypt(attributes.password, salt, 64, (err, buffer) => {
    //   const hashed = buffer.toString("hex");
    // });

    const buf = await scrypt(attributes.password, salt, 64);

    const records = await this.getAll();

    const record = {
      ...attributes, // ... means all the props and then below  the password prop
      password: `${buf.toString("hex")}.${salt}`, // the . before salt is so we know where salt begins
    };
    records.push(record);
    await this.writeAll(records);
    return record;
  }
  async comparePasswords(savedPassword, suppliedPassword) {
    // let parts = savedPassword.split(".");
    // const hashed = parts[0]
    // const salt = parts[1];
    const [hashed, salt] = savedPassword.split(".");
    const hashSuppliedBuf = await scrypt(suppliedPassword, salt, 64);

    return hashed === hashSuppliedBuf.toString("hex");
  }
}

// better to create the instance here than simply exporting the class and creating the instance elsewhere because let's say you accidentally instantiate user.json instead of users.json and you end up with one of each. Could be problematic
module.exports = new UsersRepository("users.json");
