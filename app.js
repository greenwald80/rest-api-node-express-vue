const { json } = require("express");
const express = require("express");
const app = express();
const path = require("path");
const { v4 } = require("uuid");
const PORT = process.env.PORT || 4000;

let CONTACTS = [{ id: v4(), name: "Alex", value: "0934336764", marked: false }];

//GET from API
app.get("/api/contacts", (req, res) => {
  setTimeout(() => {
    res.status(200).json(CONTACTS);
  }, 1000);
});

//POST желательно добавить серверную валидацию, недостаточно на клиенте                   
app.use(express.json()); //чтобы работать с реквестами
app.post("/api/contacts", (req, res) => {
  const contact = { ...req.body, id: v4(), marked: false };
  CONTACTS.push(contact);
  res.status(201).json(contact); //status 201 = элемент был создан
});

//DELETE
app.delete("/api/contacts/:id", (req, res) => {
  CONTACTS = CONTACTS.filter((c) => c.id !== req.params.id);
  res.status(200).json({ message: "Contact was deleted" });
});

//PUT
app.put("/api/contacts/:id", (req, res) => {
  const idx = CONTACTS.findIndex((c) => c.id === req.params.id);
  CONTACTS[idx] = req.body;
  res.json(CONTACTS[idx]);
});

app.use(express.static(path.resolve(__dirname, "client")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server has been started on port ${PORT}...`);
});
