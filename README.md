# LabFinalWeb
Travel Website with Attractions, Visitors, and Reviews
This project is a dynamic travel website that allows users to interact with attractions, visitors, and reviews. The website is designed to help users discover and rate attractions, as well as share their experiences through reviews. The platform enables visitors to create profiles, explore various attractions, and leave reviews based on their experiences. Additionally, users can view the ratings, location, and entry fee of each attraction.

Features
Attractions Management: Users can view, add, edit, and delete attractions. Each attraction has details like name, location, entry fee, and rating.
Visitor Profiles: Visitors can create and manage their profiles. The platform allows visitors to provide their personal information such as name and email.
Review System: Visitors can leave reviews for attractions they have visited. The reviews include ratings and comments. Visitors can only review an attraction once.
Top-Rated Attractions: The site has a route that displays the top 5 highest-rated attractions.
Visitor Activity: The platform allows administrators to view the number of reviews each visitor has posted, offering insights into visitor activity.
Tech Stack
Frontend:
EJS (Embedded JavaScript Templating)
HTML5, CSS3 (for styling)
JavaScript (for interactivity)
Backend:
Node.js with Express.js
MongoDB for data storage
Mongoose for interacting with MongoDB
Features:
Form validation for attraction and visitor data
Dynamic rendering of data using EJS templates
RESTful API for CRUD operations on attractions, visitors, and reviews
User-friendly interface with responsive design
Routes
Home Page (/):

Provides links to attractions, visitors, and reviews sections.
Displays options to create new attractions, visitors, and reviews.
Attractions (/attractions):

View, create, edit, and delete attractions.
Each attraction is displayed as a card with its details (Name, Location, Entry Fee, Rating).
Visitors (/visitors):

View, create, edit, and delete visitor profiles.
Displays visitors as cards with their details (Name, Email).
Reviews (/reviews):

Create, edit, and delete reviews for attractions.
Reviews are linked to visitors and attractions.
Displays reviews for attractions along with ratings and comments.
Top-Rated Attractions (/attractions/top-rated):

Displays the top 5 highest-rated attractions.
Visitor Activity (/visitors/activity):

Displays a list of visitors and counts the number of attractions they have reviewed.
