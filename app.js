const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import models
const Attraction = require('./models/attraction');
const Visitor = require('./models/Visitor');
const Review = require('./models/Review');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('public'));
app.set('view engine', 'ejs');

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/travelDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Routes

// Root Route with Navigation buttons
app.get('/', (req, res) => {
    res.render('home');
});

// Attraction Routes
app.get('/attractions', async (req, res) => {
    try {
        const attractions = await Attraction.find();
        res.render('attractions', { attractions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/attractions/:id/edit', async (req, res) => {
    try {
        const attraction = await Attraction.findById(req.params.id);
        if (!attraction) {
            return res.status(404).json({ error: 'Attraction not found' });
        }
        res.render('update-attraction', { attraction });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/attractions/:id', async (req, res) => {
    try {
        const { Name, location, entryFee, rating } = req.body;
        const updatedAttraction = await Attraction.findByIdAndUpdate(
            req.params.id,
            { Name, location, entryFee, rating },
            { new: true }
        );
        res.redirect('/attractions');
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/attractions', async (req, res) => {
    try {
        const { Name, location, entryFee, rating } = req.body;
        const newAttraction = new Attraction({
            Name,
            location,
            entryFee,
            rating
        });
        await newAttraction.save();
        res.redirect('/attractions');
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/attractions/:id/delete', async (req, res) => {
    try {
        await Attraction.findByIdAndDelete(req.params.id);
        res.redirect('/attractions');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Visitor Routes
app.get('/visitors', async (req, res) => {
    try {
        const visitors = await Visitor.find();
        res.render('visitors', { visitors });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/visitors', async (req, res) => {
    try {
        const { name, email } = req.body;
        const newVisitor = new Visitor({ name, email });
        await newVisitor.save();
        res.redirect('/visitors');
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/visitors/:id/edit', async (req, res) => {
    try {
        const visitor = await Visitor.findById(req.params.id);
        if (!visitor) {
            return res.status(404).json({ error: 'Visitor not found' });
        }
        res.render('update-visitor', { visitor });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/visitors/:id', async (req, res) => {
    try {
        const { name, email } = req.body;
        const updatedVisitor = await Visitor.findByIdAndUpdate(
            req.params.id,
            { name, email },
            { new: true }
        );
        res.redirect('/visitors');
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/visitors/:id/delete', async (req, res) => {
    try {
        await Visitor.findByIdAndDelete(req.params.id);
        res.redirect('/visitors');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Review Routes
// Route to display reviews
app.get('/reviews', async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('visitor') // Populate the visitor field with full visitor details
            .populate('attraction'); // Populate the attraction field with full attraction details

        res.render('reviews', { reviews });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching reviews');
    }
});



app.post('/reviews', async (req, res) => {
    try {
        const { visitor, attraction, score, comment } = req.body;

        const newReview = new Review({
            visitor,
            attraction,
            score,
            comment
        });

        await newReview.save();
        res.redirect('/reviews');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating review');
    }
});


app.get('/reviews/:id/edit', async (req, res) => {
    try {
        const review = await Review.findById(req.params.id).populate('attraction visitor');
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }
        res.render('update-review', { review });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/reviews/:id', async (req, res) => {
    try {
        const { score, comment } = req.body;
        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            { score, comment },
            { new: true }
        );
        res.redirect('/reviews');
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/reviews/:id/delete', async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.redirect('/reviews');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to fetch top 5 rated attractions
app.get('/attractions/top-rated', async (req, res) => {
    try {
        // Fetch top 5 attractions based on rating
        const topRatedAttractions = await Attraction.find()
            .sort({ rating: -1 })  // Sort by rating in descending order
            .limit(5);  // Limit the results to top 5

        // Render the attractions.ejs and pass the top-rated attractions
        res.render('attractions', { attractions: topRatedAttractions });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching top-rated attractions.");
    }
});

// Route to get visitors' review activity (number of reviews per visitor)
app.get('/visitors/activity', async (req, res) => {
    try {
        // Aggregate the reviews to count the number of reviews per visitor
        const visitorActivity = await Review.aggregate([
            {
                $group: {
                    _id: '$visitor',  // Group by visitor
                    reviewCount: { $sum: 1 },  // Count the number of reviews per visitor
                }
            },
            {
                $lookup: {
                    from: 'visitors',  // Join with the visitors collection
                    localField: '_id',
                    foreignField: '_id',
                    as: 'visitorInfo'
                }
            },
            {
                $unwind: '$visitorInfo'  // Flatten the visitor information
            },
            {
                $project: {
                    _id: 0,  // Exclude the default _id field
                    visitorName: '$visitorInfo.name',
                    reviewCount: 1
                }
            }
        ]);

        // Render visitors activity data
        res.render('visitors-activity', { visitorActivity });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching visitors' activity.");
    }
});


// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
