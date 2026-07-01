require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors());
app.use(express.json());

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

app.post("/visit", async (req, res) => {

    const ip =
        req.headers["x-forwarded-for"] ||
        req.socket.remoteAddress ||
        "Unknown";

    const userAgent = req.headers["user-agent"] || "";

    const { page, browser, os, country, city } = req.body;

    const { error } = await supabase
        .from("biddayvisit")
        .insert([
            {
                page,
                browser,
                os,
                country,
                city,
                ip
            }
        ]);

    if (error) {
        console.log(error);
        return res.status(500).send("Error");
    }

    res.send("OK");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Visit Logger Running on port ${PORT}`);
});