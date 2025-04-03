const authRoutes = require('./routes/auth');
const storiesRoutes = require('./routes/stories');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stories', storiesRoutes); 