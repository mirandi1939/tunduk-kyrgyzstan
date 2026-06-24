import app from "./app.js";

const PORT = process.env.PORT || 5001;

app.listen(PORT, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log(`✅ Server running on port ${PORT}`);
});