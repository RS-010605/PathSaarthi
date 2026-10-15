
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { Career, Contribution } from './models.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN?.split(',') || true,
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

const mongoReady = () => mongoose.connection.readyState === 1;

// --------------------------------------------------
// Health check
// --------------------------------------------------

app.get('/', (req, res) => {
  res.json({
    message: 'PathSaarthi Gujarat API is running',
    status: 'OK',
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    database: mongoReady() ? 'connected' : 'disconnected',
  });
});

// --------------------------------------------------
// Public career routes
// --------------------------------------------------

app.get('/api/careers', async (req, res, next) => {
  try {
    if (!mongoReady()) {
      return res.status(503).json({
        message: 'MongoDB unavailable',
      });
    }

    const query = { status: { $ne: 'archived' } };

    if (req.query.q) {
      query.$text = { $search: String(req.query.q) };
    }

    if (req.query.industry) {
      query.industry = String(req.query.industry);
    }

    const docs = await Career.find(query)
      .sort({ trendingPriority: 1, name: 1 })
      .lean();

    return res.json(
      docs.map(({ _id, __v, ...career }) => career)
    );
  } catch (error) {
    next(error);
  }
});

app.get('/api/careers/:slug', async (req, res, next) => {
  try {
    if (!mongoReady()) {
      return res.status(503).json({
        message: 'MongoDB unavailable',
      });
    }

    const doc = await Career.findOne({
      $or: [
        { slug: req.params.slug },
        { id: req.params.slug },
      ],
      status: 'published',
    }).lean();

    if (!doc) {
      return res.status(404).json({
        message: 'Career not found',
      });
    }

    const { _id, __v, ...career } = doc;
    return res.json(career);
  } catch (error) {
    next(error);
  }
});

// --------------------------------------------------
// Admin career routes
// Add career
// --------------------------------------------------

app.post('/api/admin/careers', async (req, res, next) => {
  try {
    if (!mongoReady()) {
      return res.status(503).json({
        message: 'MongoDB unavailable',
      });
    }

    const { id, slug, name, description } = req.body;

    if (
      typeof id !== 'string' ||
      !id.trim() ||
      typeof name !== 'string' ||
      !name.trim() ||
      typeof description !== 'string' ||
      !description.trim()
    ) {
      return res.status(400).json({
        message:
          'Career ID, name, and description are required.',
      });
    }

    const careerData = {
      ...req.body,
      id: id.trim(),
      slug:
        typeof slug === 'string' && slug.trim()
          ? slug.trim()
          : id.trim(),
      name: name.trim(),
      description: description.trim(),
    };

    const doc = await Career.create(careerData);

    return res.status(201).json(doc);
  } catch (error) {
    next(error);
  }
});

// Update career
app.patch('/api/admin/careers/:id', async (req, res, next) => {
  try {
    if (!mongoReady()) {
      return res.status(503).json({
        message: 'MongoDB unavailable',
      });
    }

    const updates = { ...req.body };

    // Do not allow changing the document identity through this route.
    delete updates._id;
    delete updates.id;
    delete updates.__v;

    const doc = await Career.findOneAndUpdate(
      { id: req.params.id },
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!doc) {
      return res.status(404).json({
        message: 'Career not found',
      });
    }

    return res.json(doc);
  } catch (error) {
    next(error);
  }
});

// Archive career
app.delete('/api/admin/careers/:id', async (req, res, next) => {
  try {
    if (!mongoReady()) {
      return res.status(503).json({
        message: 'MongoDB unavailable',
      });
    }

    const doc = await Career.findOneAndUpdate(
      { id: req.params.id },
      { $set: { status: 'archived' } },
      { new: true }
    );

    if (!doc) {
      return res.status(404).json({
        message: 'Career not found',
      });
    }

    return res.json({
      ok: true,
      career: doc,
    });
  } catch (error) {
    next(error);
  }
});

// Replace career roadmap
app.put(
  '/api/admin/careers/:id/roadmap',
  async (req, res, next) => {
    try {
      if (!mongoReady()) {
        return res.status(503).json({
          message: 'MongoDB unavailable',
        });
      }

      if (!Array.isArray(req.body.roadmap)) {
        return res.status(400).json({
          message: 'Roadmap must be an array.',
        });
      }

      const roadmap = req.body.roadmap.map((step, index) => ({
        ...step,
        sequence: index + 1,
      }));

      const doc = await Career.findOneAndUpdate(
        { id: req.params.id },
        { $set: { roadmap } },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!doc) {
        return res.status(404).json({
          message: 'Career not found',
        });
      }

      return res.json(doc);
    } catch (error) {
      next(error);
    }
  }
);

// --------------------------------------------------
// Contributions
// --------------------------------------------------

app.post('/api/contributions', async (req, res, next) => {
  try {
    if (!mongoReady()) {
      return res.status(503).json({
        message: 'MongoDB unavailable',
      });
    }

    const doc = await Contribution.create(req.body);

    return res.status(201).json(doc);
  } catch (error) {
    next(error);
  }
});

app.get('/api/admin/contributions', async (req, res, next) => {
  try {
    if (!mongoReady()) {
      return res.status(503).json({
        message: 'MongoDB unavailable',
      });
    }

    const docs = await Contribution.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.json(
      docs.map(({ _id, __v, ...contribution }) => contribution)
    );
  } catch (error) {
    next(error);
  }
});

app.patch(
  '/api/admin/contributions/:id',
  async (req, res, next) => {
    try {
      if (!mongoReady()) {
        return res.status(503).json({
          message: 'MongoDB unavailable',
        });
      }

      const updates = { ...req.body };
      delete updates._id;
      delete updates.id;
      delete updates.__v;

      const doc = await Contribution.findOneAndUpdate(
        { id: req.params.id },
        { $set: updates },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!doc) {
        return res.status(404).json({
          message: 'Contribution not found',
        });
      }

      return res.json(doc);
    } catch (error) {
      next(error);
    }
  }
);

// --------------------------------------------------
// Error handling
// --------------------------------------------------

app.use((error, req, res, next) => {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return res.status(400).json({
      message: error.message,
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      message: 'A record with this ID or slug already exists.',
    });
  }

  return res.status(500).json({
    message: 'Internal server error',
  });
});

// --------------------------------------------------
// Start server
// --------------------------------------------------

async function start() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is missing from server/.env');
    process.exitCode = 1;
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB || undefined,
    });

    console.log('MongoDB connected');

    app.listen(port, () => {
      console.log(
        `PathSaarthi API listening on http://localhost:${port}`
      );
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exitCode = 1;
  }
}

start();
