const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const moment = require("moment");

app.use(bodyParser.json());

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/", async (req, res) => {
  try {
    const data = req.body;
    const message = await prisma.message.create({
      data,
    });
    res.status(201).json({
      message,
    });
  } catch (error) {
    console.log(error);
  }
});
app.get("/all-messages", async (req, res) => {
  try {
    const message = await prisma.message.findMany({});
    res.status(200).json({
      message,
    });
  } catch (error) {
    console.log(error);
  }
});
app.get("/all-messages/:date/day", async (req, res) => {
  try {
    const date = moment(req.params.date);

    const message = await prisma.message.findMany({
      where: {
        // filtering system to find records in a day
        createdAt: {
          // greater than the start of the day
          gte: date.startOf("day").toDate(),
          //   lt: date.endOf("week").toDate(),
          // lesser than the end of the day
          lt: date.endOf("day").toDate(),
          //lt: date.endOf("week").toDate(),
        },
      },
    });
    console.log(message);

    res.status(200).json({
      message,
    });
  } catch (error) {
    console.log(error);
  }
});

app.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const message = await prisma.message.update({
      where: {
        id,
      },
      data,
    });
    res.status(200).json({
      message,
    });
  } catch (error) {
    console.log(error);
  }
});

app.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const message = await prisma.message.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      status: "Success",
      message,
    });
  } catch (error) {
    console.log(error);
  }
});
app.listen(port, () => {
  console.log(`server is listening to port${port}`);
});
