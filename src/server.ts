import express from "express";
import { PrismaClient } from "@prisma/client";
import convertHourStringToMinutes from "./utils/convert-hour-string-to-minutes";

const app = express();
app.use(express.json());
const prisma = new PrismaClient({
  log: ["query", "info", "warn"],
});

app.get("/games", async (req, res) => {
  const games = await prisma.game.findMany({
    include: {
      _count: {
        select: {
          Ads: true,
        },
      },
    },
  });

  return res.json(games);
});

app.post("/games/:id/ads", async (req, res) => {
  const gameId = req.params.id;
  const body: any = req.body;

  const ad = await prisma.ad.create({
    data: {
      gameId,
      name: body.name,
      yearsPlaying: body.yearsPlaying,
      discord: body.discord,
      weekDays: body.weekDays.join(","),
      hoursStart: convertHourStringToMinutes(body.hoursStart),
      hoursEnd: convertHourStringToMinutes(body.hoursEnd),
      useVoiceChanel: body.useVoiceChanel,
    },
  });

  return res.status(201).json([]);
});

app.get("/games/:id/ads", async (req, res) => {
  const id: any = req.params.id;

  const ads = await prisma.ad.findMany({
    select: {
      id: true,
      name: true,
      weekDays: true,
      useVoiceChanel: true,
      yearsPlaying: true,
      hoursEnd: true,
      hoursStart: true,
      createAt: true,
    },
    where: {
      gameId: id,
    },
    orderBy: {
      createAt: "desc",
    },
  });

  return res.json(
    ads.map((ad: any) => {
      return { ...ad, weekDays: ad.weekDays.split(",") };
    })
  );
});

app.get("/ads/:id/discord", async (req, res) => {
  const id: any = req.params.id;

  const ad = await prisma.ad.findUniqueOrThrow({
    where: {
      id,
    },
    select: {
      discord: true,
    },
  });

  return res.json({
    discord: ad?.discord,
  });
});

app.get("/ads", async (req, res) => {
  const ads = await prisma.ad.findMany({
    include: {
      game: true,
    },
  });

  return res.json(ads);
});

app.listen(3000, () => {});
