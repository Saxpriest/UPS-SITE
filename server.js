// server.js - simple Express server with a /api/track/:tn endpoint that returns simulated tracking details
const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function pseudoHash(s){
  let seed = 0;
  for(let i=0;i<s.length;i++) seed = (seed*131 + s.charCodeAt(i)) % 10007;
  return seed;
}

app.get('/api/track/:tn', (req, res) => {
  const tn = req.params.tn || '';
  if(!/^[A-Za-z0-9\-]{6,30}$/.test(tn)){
    return res.status(400).json({ error: 'Invalid tracking number format.' });
  }
  const seed = pseudoHash(tn);
  const idx = seed % 5;
  const statuses = ['Picked up','Origin scan','In transit','Out for delivery','IN-ROUTE'];
  const now = Date.now();
  const events = [];
  const locs = ['Los Angeles, CA','Phoenix, AZ','Dallas, TX','Atlanta, GA','Newark, NJ'];
  for(let i=0;i<5;i++){
    const t = new Date(now - (4-i)*12*3600*1000);
    events.push({ time: t.toLocaleString(), status: statuses[i], location: locs[i] });
  }
  res.json({
    trackingNumber: tn,
    status: statuses[idx],
    origin: locs[0],
    destination: locs[4],
    weight: (seed%50 + 1) + ' lbs',
    service: ['Ground','2nd Day Air','Next Day Air'][seed%3],
    estimatedDelivery: new Date(now + (4-idx)*1256*3600*1000).toLocaleDateString(),
    events
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log('Replica server listening on port', PORT));
