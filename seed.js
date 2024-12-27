const mongoose = require('mongoose');
const Attraction = require('./models/attraction');
const Visitor = require('./models/Visitor');
const Review = require('./models/Review');

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/travelDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('MongoDB Connected for seeding...');
        seedDatabase();
    })
    .catch(err => console.error('MongoDB Connection Error:', err));

async function seedDatabase() {
    try {
        // Clear existing data
        await Attraction.deleteMany({});
        await Visitor.deleteMany({});
        await Review.deleteMany({});

        // Seed Attractions
        const attractions = await Attraction.create([
            { Name: 'Eiffel Tower', location: 'Paris, France', entryFee: 25, rating: 4.8 },
            { Name: 'Great Wall of China', location: 'China', entryFee: 30, rating: 4.7 },
            { Name: 'Colosseum', location: 'Rome, Italy', entryFee: 20, rating: 4.6 },
            { Name: 'Taj Mahal', location: 'Agra, India', entryFee: 15, rating: 4.9 }
        ]);

        // Seed Visitors
        const visitors = await Visitor.create([
            { name: 'Alice Johnson', email: 'alice.johnson@example.com', visitedAttractions: [attractions[0]._id, attractions[2]._id] },
            { name: 'Bob Smith', email: 'bob.smith@example.com', visitedAttractions: [attractions[1]._id, attractions[3]._id] },
            { name: 'Charlie Brown', email: 'charlie.brown@example.com', visitedAttractions: [attractions[0]._id, attractions[1]._id] }
        ]);

        // Seed Reviews
        await Review.create([
            { attraction: attractions[0]._id, visitor: visitors[0]._id, score: 5, comment: 'Amazing experience at the Eiffel Tower!' },
            { attraction: attractions[2]._id, visitor: visitors[1]._id, score: 4, comment: 'The Colosseum is full of history.' },
            { attraction: attractions[3]._id, visitor: visitors[2]._id, score: 5, comment: 'The Taj Mahal is breathtaking.' },
            { attraction: attractions[1]._id, visitor: visitors[2]._id, score: 4, comment: 'Great Wall of China is a must-see!' }
        ]);

        console.log('Database seeded successfully!');
        mongoose.disconnect();
    } catch (error) {
        console.error('Error seeding database:', error);
        mongoose.disconnect();
    }
}
