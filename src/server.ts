import express from "express";

const app = express();

app.get("/ads", (req, res) => {
    return res.json([
        {
            id: 1,
            title: "Ad 1",
            description: "Description 1",
        },
        {
            id: 2,
            title: "Ad 2",
            description: "Description 2",
        },
        {
            id: 3,
            title: "Ad 3",
            description: "Description 3",
        },
    ]);
});

app.listen(3000, () => { });