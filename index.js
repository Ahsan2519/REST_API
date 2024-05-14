const express = require("express");
const users = require("./MOCK_DATA.json");
const fs = require("fs");

const app = express();
const PORT = 8000;

// middleware
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => res.send("welcome to home page"));

app
  .route("/api/users")
  .get((req, res) => {
    res.json(users);
  })
  .post((req, res) => {
    console.log(req.body);
    users.push({ ...req.body, id: users.length + 1 });
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
      return err
        ? res.status(500).json({ error: "Internal Server Error" })
        : res.json({ status: "success", id: users.length });
    });
  });

app.get("/users", (req, res) => {
  html = `
    <ul>
    ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `;
  res.send(html);
});

app
  .route("/api/users/:id")
  .get((req, res) => {
    id = Number(req.params.id);
    const selectedUser = users.find((userId) => userId.id === id);
    res.json(selectedUser);
  })
  .delete((req, res) => {
    const id = Number(req.params.id);
    const deletedUserIndex = users.findIndex((user) => user.id === id);
    if (deletedUserIndex !== -1) {
      users.splice(deletedUserIndex, 1);
      fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
        return err
          ? res.status(500).json({ error: "Internal Server Error" })
          : res.json({ status: "success", id: id });
      });
    }
  })
  .patch((req, res) => {
    const id = Number(req.params.id);
    const { first_name, last_name, email, job_title, gender } = req.body;
    const userToUpdate = users.find(user => user.id === id);
    if (userToUpdate) {
      userToUpdate.first_name = first_name;
      userToUpdate.last_name = last_name;
      userToUpdate.email = email;
      userToUpdate.job_title = job_title;
      userToUpdate.gender = gender;
      fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
        if (err) {
          return res.status(500).json({ error: "Internal Server Error" });
        }
        res.json({ status: "success", id: id });
      });
    }
  });
  

app.listen(PORT, () => console.log(`Server started at ${PORT}`));
