const functions = require('firebase-functions');
const app = require('express')();
const admin = require('firebase-admin');

admin.initializeApp();

const databaseUsers = admin.firestore().collection('users');
const databaseIncidents = admin.firestore().collection('incidents');

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
  app.use(cors())
  next();
})

app.get('/users', (req, res) => {
  databaseUsers.get()
    .then(data => {
      let users = [];
      data.forEach(doc => {
        users.push(doc.data());
      });
      return res.json(users);
    })
    .catch(err => console.error(err));
})

app.post('/users', (req, res) => {
  const newUser = {
    personal: {
      name: req.body.personal.name,
      email: req.body.personal.email,
      password: req.body.personal.password,
      phone: req.body.personal.phone,
      picture: 'base64',
      banner: 'base64'
    },
    status: {
      title: req.body.status.title,
      rankPosition: req.body.status.rankPosition,
      incidents: {
        registerd: 0,
        helped: 0,
        denounced: 0,
      }
    },
    preferences: {
      darkTheme: true,
      bigFonts: false
    },
    location: {
      addressComplete: req.body.location.addressComplete,
      latitude: req.body.location.latitude,
      longitude: req.body.location.longitude
    }
  }

  databaseUsers.add(newUser)
    .then(doc => {
      res.json({ message: `document ${doc.id} created successfully` });
    }
    )
    .catch(err => {
      res.status(500).json({ error: 'something went wrong' });
      console.error(err);
    }
    )
})

app.put('/users/:id', (req, res) => {
  databaseUsers.doc(req.params.id).update(req.body)
    .then(() => {
      res.json({ message: `document ${req.params.id} updated successfully` });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    })
})

app.delete('/users/:id', (req, res) => {
  databaseUsers.doc(req.params.id).delete()
    .then(() => {
      res.json({ message: `document ${req.params.id} deleted successfully` });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    })
})

app.get('/incidents', (req, res) => {
  databaseIncidents.get()
    .then(data => {
      let incidents = [];
      data.forEach(doc => {
        incidents.push(doc.data());
      });
      return res.json(incidents);
    })
    .catch(err => console.error(err));
})

app.post('/incidents', (req, res) => {
  const newIncident = {
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    icon: req.body.icon,
    details: {
      description: req.body.details.description,
      image: 'base64',
      location: req.body.details.location,
      title: req.body.details.title,
      type: req.body.details.type
    },
    status: "active",
    author: {
      id: req.body.author.id,
      name: req.body.author.name,
    },
    comments: req.body.comments
  }

  databaseIncidents.add(newIncident)
    .then(doc => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch(err => {
      res.status(500).json({ error: 'something went wrong' });
      console.error(err);
    })
})

app.put('/incidents/:id', (req, res) => {
  databaseIncidents.doc(req.params.id).update(req.body)
    .then(() => {
      res.json({ message: `document ${req.params.id} updated successfully` });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    })
})

app.delete('/incidents/:id', (req, res) => {
  databaseIncidents.doc(req.params.id).delete()
    .then(() => {
      res.json({ message: `document ${req.params.id} deleted successfully` });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    })
})




exports.api = functions.https.onRequest(app);