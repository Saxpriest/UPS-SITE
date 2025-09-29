// script.js - client logic. Calls server /api/track/:tn, fallback to client simulation if needed.
document.addEventListener('DOMContentLoaded', ()=>{
  const trackBtn = document.getElementById('trackBtn');
  const trackingInput = document.getElementById('trackingInput');
  const errorMsg = document.getElementById('errorMsg');
  const resultSection = document.getElementById('resultSection');
  const statusText = document.getElementById('statusText');
  const trackingNumberEl = document.getElementById('trackingNumber');
  const originEl = document.getElementById('origin');
  const destinationEl = document.getElementById('destination');
  const weightEl = document.getElementById('weight');
  const serviceEl = document.getElementById('service');
  const estDeliveryEl = document.getElementById('estDelivery');
  const eventsList = document.getElementById('eventsList');
  const toggleDetails = document.getElementById('toggleDetails');

  toggleDetails.addEventListener('click', ()=>{
    eventsList.classList.toggle('collapsed');
    toggleDetails.textContent = eventsList.classList.contains('collapsed') ? 'View Details' : 'Hide Details';
  });

  function isValid(tn){ return /^[A-Za-z0-9\-]{6,30}$/.test(tn); }

  async function fetchServer(tn){
    try{
      const res = await fetch('/api/track/' + encodeURIComponent(tn));
      if(!res.ok) throw new Error('Server error');
      return await res.json();
    }catch(e){ return null; }
  }

  trackBtn.addEventListener('click', async ()=>{
    errorMsg.textContent = '';
    const tn = trackingInput.value.trim();
    if(!tn){ errorMsg.textContent = 'Please enter a tracking number.'; return; }
    if(!isValid(tn)){ errorMsg.textContent = 'Invalid format. Use letters, numbers, or dashes.'; return; }

    // Try server first
    const serverData = await fetchServer(tn);
    if(serverData){
      renderResult(serverData);
      return;
    }

    // Fallback: client-side simulated response
    const simulated = simulateTracking(tn);
    renderResult(simulated);
  });

  function renderResult(data){
    resultSection.style.display = 'block';
    statusText.textContent = data.status;
    trackingNumberEl.textContent = data.trackingNumber;
    originEl.textContent = data.origin;
    destinationEl.textContent = data.destination;
    weightEl.textContent = data.weight;
    serviceEl.textContent = data.service;
    estDeliveryEl.textContent = data.estimatedDelivery;

    // events
    eventsList.innerHTML = '';
    data.events.forEach(ev=>{
      const li = document.createElement('li');
      li.innerHTML = `<div class="event-dot" aria-hidden="true"></div>
                      <div class="event-body">
                        <div class="event-time">${ev.time}</div>
                        <div class="event-status">${ev.status}</div>
                        <div class="event-location">${ev.location}</div>
                      </div>`;
      eventsList.appendChild(li);
    });
    // ensure details are visible by default
    eventsList.classList.remove('collapsed');
    toggleDetails.textContent = 'Hide Details';
  }

  function simulateTracking(tn){
    // stable pseudo-random based on tracking string
    let seed = 0; for(let i=0;i<tn.length;i++) seed = (seed*131 + tn.charCodeAt(i)) % 10007;
    const idx = seed % 5;
    const statuses = ['Picked up✅','Origin scan✅','In transit','Out for delivery','Delivered'];
    const now = new Date();
    const events = [];
    const locs = ['Washington✅, DC','SCAN CONFIRMED FOR LINDSEY PALMER','IN ROUTE','IN ROUTE','IN ROUTE'];
    for(let i=0;i<5;i++){
      const d = new Date(now.getTime() - (4-i)*12*3600*1000);
      events.push({
        time: d.toLocaleString(),
        status: statuses[i],
        location: locs[i]
      });
    }
    return {
      trackingNumber: tn,
      status: statuses[idx],
      origin: locs[0],
      destination: locs[4],
      weight: (Math.floor(seed%50)+1) + ' lbs',
      service: ['Ground','2nd Day Air','Next Day Air'][seed%3],
      estimatedDelivery: new Date(now.getTime() + (4-idx)*24*15600*1000).toLocaleDateString(),
      events
    };
  }document.addEventListener("DOMContentLoaded", () => {
  const trackBtn = document.getElementById("trackBtn");
  const trackingInput = document.getElementById("trackingInput");
  const truck = document.querySelector(".truck");
  const progressBar = document.querySelector(".progress-bar");
  const routeStatusText = document.getElementById("routeStatusText");
  const iconSteps = document.querySelectorAll(".icon-step span");

  trackBtn.addEventListener("click", () => {
    const trackingNumber = trackingInput.value.trim();
    if (!trackingNumber) {
      alert("Please enter a tracking number.");
      return;
    }

    // Reset state
    truck.style.animationPlayState = "running";
    progressBar.style.width = "0%";
    progressBar.style.background = "#ffc72c";
    routeStatusText.textContent = "Tracking started...";
    routeStatusText.style.color = "#3d2b1f";
    iconSteps.forEach(icon => icon.style.color = "#999");

    // Stage 1
    setTimeout(() => {
      progressBar.style.width = "33%";
      routeStatusText.textContent = "In Transit";
      iconSteps[0].style.color = "#ffc72c";
    }, 2000);

    // Stage 2
    setTimeout(() => {
      progressBar.style.width = "66%";
      routeStatusText.textContent = "Out for Delivery";
      iconSteps[1].style.color = "#ffc72c";
    }, 4000);

    // Stage 3
    setTimeout(() => {
      progressBar.style.width = "100%";
      progressBar.style.background = "#3d2b1f";
      routeStatusText.textContent = "Delivered ✅";
      routeStatusText.style.color = "#00704A";
      iconSteps[2].style.color = "#00704A";
      truck.style.animationPlayState = "paused";
    }, 6000);
  });
});

});
