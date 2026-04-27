const { useState, useEffect, useRef } = React;

// ─── IMAGEKIT CONFIG ──────────────────────────────────────────────────────────
const IMAGEKIT_PUBLIC_KEY = "public_oBEPFRNgs"; // ← replace with your full key
const IMAGEKIT_URL_ENDPOINT = "https://ik.imagekit.io/6hlxcszeo";

// ─── FIRST-TIME WAIVER ────────────────────────────────────────────────────────
const FIRST_TIME_KEY = "renteasy_has_unlocked";
const isFirstTimeUser = () => !localStorage.getItem(FIRST_TIME_KEY);
const markUserAsReturning = () => localStorage.setItem(FIRST_TIME_KEY, "true");

// ─── IMAGE UPLOAD ─────────────────────────────────────────────────────────────
async function uploadToImageKit(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", `renteasy_${Date.now()}_${file.name}`);
    formData.append("publicKey", IMAGEKIT_PUBLIC_KEY);
    const res = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST", body: formData,
    });
    const data = await res.json();
    return data.url || URL.createObjectURL(file);
  } catch {
    return URL.createObjectURL(file);
  }
}

// ─── DATA ────────────────────────────────────────────────────────────────────

const PROPERTIES = [
  {
    id: 1, title: "Modern 3-Bedroom House", location: "Borrowdale, Harare",
    city: "Harare", price: 850, type: "House", bedrooms: 3, bathrooms: 2,
    description: "Spacious modern home with garden, parking and borehole. Quiet neighbourhood close to schools and shops. Recently renovated kitchen and bathrooms.",
    landlord: { name: "Mr. Chikwanda", initials: "MC", phone: "+263 77 234 5678", email: "chikwanda@gmail.com", rating: 4.8, properties: 3 },
    emoji: "🏡", available: true, viewingFee: 10,
    photos: [],
    amenities: ["Borehole", "Garden", "2x Parking", "Security Gate", "Prepaid ZESA"],
    posted: "2 days ago",
  },
  {
    id: 2, title: "Cozy 2-Bedroom Flat", location: "Avondale, Harare",
    city: "Harare", price: 450, type: "Flat", bedrooms: 2, bathrooms: 1,
    description: "Well-maintained flat on 2nd floor. ZESA prepaid, city water, communal garden. Walking distance to Avondale shops and restaurants.",
    landlord: { name: "Mrs. Moyo", initials: "MM", phone: "+263 71 345 6789", email: "moyorent@gmail.com", rating: 4.5, properties: 5 },
    emoji: "🏠", available: true, viewingFee: 5,
    photos: [],
    amenities: ["City Water", "Prepaid ZESA", "Parking", "Security Guard"],
    posted: "5 days ago",
  },
  {
    id: 3, title: "Executive 4-Bedroom Home", location: "Highlands, Harare",
    city: "Harare", price: 1400, type: "House", bedrooms: 4, bathrooms: 3,
    description: "Luxury executive home with pool, double garage, staff quarters and fully fitted kitchen. Ideal for expats and corporate tenants.",
    landlord: { name: "Tatenda Properties", initials: "TP", phone: "+263 77 456 7890", email: "tatenda.props@gmail.com", rating: 5.0, properties: 8 },
    emoji: "🏰", available: true, viewingFee: 20,
    photos: [],
    amenities: ["Pool", "Double Garage", "Staff Quarters", "Alarm System", "Borehole", "Electric Fence"],
    posted: "1 day ago",
  },
  {
    id: 4, title: "1-Bedroom Studio Apartment", location: "Belgravia, Harare",
    city: "Harare", price: 280, type: "Studio", bedrooms: 1, bathrooms: 1,
    description: "Compact and affordable studio apartment. Perfect for a single professional. Secure complex with 24/7 guard and communal laundry.",
    landlord: { name: "Mr. Ncube", initials: "MN", phone: "+263 73 567 8901", email: "ncube.rentals@gmail.com", rating: 4.2, properties: 2 },
    emoji: "🏢", available: true, viewingFee: 5,
    photos: [],
    amenities: ["24/7 Security", "Parking", "Prepaid ZESA", "Communal Laundry"],
    posted: "1 week ago",
  },
  {
    id: 5, title: "3-Bedroom Townhouse", location: "Waterfalls, Harare",
    city: "Harare", price: 600, type: "Townhouse", bedrooms: 3, bathrooms: 2,
    description: "Beautiful townhouse in a secure complex. Small garden, fitted kitchen, tiled throughout. Great for a family.",
    landlord: { name: "Grace Rentals", initials: "GR", phone: "+263 77 678 9012", email: "grace.rentals@gmail.com", rating: 4.6, properties: 4 },
    emoji: "🏘️", available: false, viewingFee: 8,
    photos: [],
    amenities: ["Garden", "Borehole", "Electric Fence", "Parking"],
    posted: "3 days ago",
  },
  {
    id: 6, title: "2-Bedroom House", location: "Suburbs, Bulawayo",
    city: "Bulawayo", price: 320, type: "House", bedrooms: 2, bathrooms: 1,
    description: "Affordable and well-located house near Bulawayo CBD. Ideal for a small family. Good road access and quiet street.",
    landlord: { name: "Mr. Dube", initials: "MD", phone: "+263 71 789 0123", email: "dube.rentals@gmail.com", rating: 4.3, properties: 1 },
    emoji: "🏠", available: true, viewingFee: 5,
    photos: [],
    amenities: ["City Water", "Parking", "Prepaid ZESA"],
    posted: "4 days ago",
  },
  {
    id: 7, title: "Furnished 2-Bedroom Flat", location: "Greendale, Harare",
    city: "Harare", price: 550, type: "Flat", bedrooms: 2, bathrooms: 1,
    description: "Fully furnished flat ready to move in. Includes beds, sofas, fridge and washing machine. Ideal for professionals relocating.",
    landlord: { name: "Sunrise Properties", initials: "SP", phone: "+263 77 890 1234", email: "sunrise.zw@gmail.com", rating: 4.7, properties: 6 },
    emoji: "🛋️", available: true, viewingFee: 8,
    photos: [],
    amenities: ["Furnished", "Borehole", "DSTV Point", "Parking", "Security"],
    posted: "Today",
  },
  {
    id: 8, title: "3-Bedroom House", location: "Hillside, Bulawayo",
    city: "Bulawayo", price: 480, type: "House", bedrooms: 3, bathrooms: 2,
    description: "Spacious family home in quiet Hillside neighbourhood. Large yard, borehole, and recently painted throughout.",
    landlord: { name: "Mrs. Ndlovu", initials: "MN", phone: "+263 71 901 2345", email: "ndlovu.props@gmail.com", rating: 4.4, properties: 3 },
    emoji: "🏡", available: true, viewingFee: 8,
    photos: [],
    amenities: ["Borehole", "Large Yard", "Parking", "Prepaid ZESA"],
    posted: "6 days ago",
  },
];

// ─── PHOTO UPLOADER COMPONENT ─────────────────────────────────────────────────
function PhotoUploader({ photos, setPhotos }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef();

  const handleFiles = async (files) => {
    const fileArr = Array.from(files).slice(0, 8 - photos.length);
    if (!fileArr.length) return;
    setUploading(true);
    const urls = await Promise.all(fileArr.map(uploadToImageKit));
    setPhotos(prev => [...prev, ...urls]);
    setUploading(false);
  };

  return (
    <div>
      <label style={{ fontSize: 12, color: "#8899AA", display: "block", marginBottom: 8 }}>📸 Property Photos (up to 8)</label>
      <div
        onClick={() => inputRef.current.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        style={{
          border: `2px dashed ${dragOver ? "#F4A228" : "#1E3A5F"}`,
          borderRadius: 12, padding: "24px 16px", textAlign: "center",
          cursor: "pointer", background: dragOver ? "rgba(244,162,40,0.05)" : "#081422",
          transition: "all 0.2s"
        }}>
        <input ref={inputRef} type="file" accept="image/*" multiple style={{ display: "none" }}
          onChange={e => handleFiles(e.target.files)} />
        <div style={{ fontSize: 28, marginBottom: 8 }}>📷</div>
        <p style={{ color: "#8899AA", fontSize: 13 }}>
          Drag & drop photos or <span style={{ color: "#F4A228", fontWeight: 600 }}>browse</span>
        </p>
        <p style={{ color: "#4a6070", fontSize: 11, marginTop: 4 }}>JPG, PNG · Max 8 photos</p>
      </div>

      {uploading && (
        <div style={{ marginTop: 10, fontSize: 13, color: "#2DD4BF", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ display: "inline-block", width: 14, height: 14, border: "2px solid #1E3A5F", borderTopColor: "#2DD4BF", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
          Uploading photos…
        </div>
      )}

      {photos.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: 8, marginTop: 12 }}>
          {photos.map((url, i) => (
            <div key={i} style={{ position: "relative", aspectRatio: "1", borderRadius: 8, overflow: "hidden" }}>
              <img src={url} alt={`Photo ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <button onClick={() => setPhotos(p => p.filter((_, j) => j !== i))}
                style={{ position: "absolute", top: 3, right: 3, background: "rgba(0,0,0,0.65)", color: "#fff", border: "none", borderRadius: "50%", width: 20, height: 20, fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PHOTO GALLERY / MODAL ────────────────────────────────────────────────────
function PhotoGallery({ photos, emoji }) {
  const [modalIdx, setModalIdx] = useState(null);

  if (!photos || photos.length === 0) {
    return (
      <div style={{ background: "linear-gradient(135deg, #1a3a5c, #0f2a45)", height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 90 }}>{emoji}</span>
      </div>
    );
  }

  return (
    <>
      <div onClick={() => setModalIdx(0)} style={{ position: "relative", height: 200, cursor: "pointer", overflow: "hidden" }}>
        <img src={photos[0]} alt="Property" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        {photos.length > 1 && (
          <span style={{ position: "absolute", bottom: 10, right: 10, background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: 12, padding: "4px 10px", borderRadius: 20, fontWeight: 600 }}>
            📷 {photos.length} photos
          </span>
        )}
      </div>

      {modalIdx !== null && (
        <div onClick={() => setModalIdx(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div onClick={e => e.stopPropagation()}
            style={{ maxWidth: 680, width: "100%", background: "#112236", borderRadius: 16, overflow: "hidden" }}>
            <img src={photos[modalIdx]} alt={`Photo ${modalIdx + 1}`}
              style={{ width: "100%", maxHeight: 420, objectFit: "cover", display: "block" }} />
            <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <button onClick={() => setModalIdx(i => Math.max(0, i - 1))} disabled={modalIdx === 0}
                style={{ background: "none", border: "1.5px solid #1E3A5F", borderRadius: 8, padding: "8px 16px", color: "#F0F4F8", cursor: "pointer", fontWeight: 600 }}>← Prev</button>
              <span style={{ color: "#8899AA", fontSize: 13 }}>{modalIdx + 1} / {photos.length}</span>
              <button onClick={() => setModalIdx(i => Math.min(photos.length - 1, i + 1))} disabled={modalIdx === photos.length - 1}
                style={{ background: "none", border: "1.5px solid #1E3A5F", borderRadius: 8, padding: "8px 16px", color: "#F0F4F8", cursor: "pointer", fontWeight: 600 }}>Next →</button>
              <button onClick={() => setModalIdx(null)}
                style={{ background: "#F4A228", color: "#0D1B2A", border: "none", borderRadius: 8, padding: "8px 20px", cursor: "pointer", fontWeight: 700 }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────

function App() {
  const [page, setPage] = useState("home");
  const [role, setRole] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterCity, setFilterCity] = useState("All");
  const [filterMax, setFilterMax] = useState(1500);
  const [filterBeds, setFilterBeds] = useState("Any");
  const [paidProperties, setPaidProperties] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);
  const [payModal, setPayModal] = useState(false);
  const [payMethod, setPayMethod] = useState("EcoCash");
  const [listingModal, setListingModal] = useState(false);
  const [landlordListings, setLandlordListings] = useState([]);
  const [notification, setNotification] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [firstTime, setFirstTime] = useState(isFirstTimeUser());
  const [newListingPhotos, setNewListingPhotos] = useState([]);
  const [newListing, setNewListing] = useState({
    title: "", location: "", city: "Harare", price: "", type: "House",
    bedrooms: "", bathrooms: "", description: "", amenities: "",
  });

  const notify = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const goTo = (p, r = null) => {
    setPage(p);
    if (r) setRole(r);
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const filteredProps = PROPERTIES.filter(p => {
    const s = searchTerm.toLowerCase();
    const matchSearch = !s || p.title.toLowerCase().includes(s) || p.location.toLowerCase().includes(s) || p.city.toLowerCase().includes(s);
    const matchType = filterType === "All" || p.type === filterType;
    const matchCity = filterCity === "All" || p.city === filterCity;
    const matchPrice = p.price <= filterMax;
    const matchBeds = filterBeds === "Any" || p.bedrooms >= parseInt(filterBeds);
    return matchSearch && matchType && matchCity && matchPrice && matchBeds;
  });

  const handlePayViewing = () => {
    setPayModal(false);
    if (firstTime) {
      markUserAsReturning();
      setFirstTime(false);
      notify("🎉 First unlock is FREE! Landlord contact unlocked.");
    } else {
      notify("✅ Payment confirmed! Landlord contact unlocked.");
    }
    setPaidProperties(prev => [...prev, selectedProperty.id]);
  };

  const handleListingSubmit = () => {
    if (!newListing.title || !newListing.location || !newListing.price) {
      notify("Please fill in all required fields.", "error"); return;
    }
    setLandlordListings(prev => [...prev, {
      ...newListing, id: Date.now(), available: true,
      emoji: "🏠", posted: "Just now", viewingFee: 5,
      photos: newListingPhotos,
      landlord: { name: "You", initials: "ME", phone: "Your phone", email: "Your email", rating: 5.0, properties: prev.length + 1 },
      amenities: newListing.amenities.split(",").map(a => a.trim()).filter(Boolean),
    }]);
    setListingModal(false);
    setNewListingPhotos([]);
    setNewListing({ title: "", location: "", city: "Harare", price: "", type: "House", bedrooms: "", bathrooms: "", description: "", amenities: "" });
    notify("🎉 Property listed! Tenants can now find it.");
  };

  // ── HOME ──────────────────────────────────────────────────────────────────
  if (page === "home") return (
    <div style={{ minHeight: "100vh", background: "#0D1B2A" }}>
      {notification && <Notification data={notification} />}
      <Nav page={page} role={role} goTo={goTo} saved={savedProperties.length}
        mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      <div style={{
        background: "linear-gradient(160deg, #0D1B2A 0%, #1a3a5c 45%, #0D1B2A 100%)",
        padding: "80px 24px 60px", textAlign: "center", borderBottom: "1px solid #1E3A5F",
        position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(244,162,40,0.04)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(45,212,191,0.04)", pointerEvents: "none" }} />

        <div className="fade-up" style={{ fontSize: 56, marginBottom: 16 }}>🏡</div>
        <h1 className="fade-up-1" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 6vw, 52px)", fontWeight: 800, color: "#F4A228", lineHeight: 1.15, marginBottom: 14 }}>
          Find Your Perfect Home<br />in Zimbabwe
        </h1>
        <p className="fade-up-2" style={{ color: "#8899AA", fontSize: 17, marginBottom: 40, maxWidth: 520, margin: "0 auto 40px" }}>
          Connecting landlords and tenants across Zimbabwe. List for free. Pay a small fee to connect.
        </p>

        {firstTime && (
          <div className="fade-up-2" style={{ display: "inline-block", background: "linear-gradient(135deg, #F4A228, #f5c85a)", color: "#0D1B2A", borderRadius: 30, padding: "10px 24px", fontWeight: 700, fontSize: 14, marginBottom: 24 }}>
            🎉 New here? Your first contact unlock is completely FREE!
          </div>
        )}

        <div className="fade-up-3" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 56 }}>
          <button className="btn-primary" onClick={() => goTo("listings", "tenant")} style={{ fontSize: 16, padding: "14px 32px" }}>
            🔍 Browse Properties
          </button>
          <button className="btn-teal" onClick={() => goTo("landlord", "landlord")} style={{ fontSize: 16, padding: "14px 32px" }}>
            🏠 List Your Property
          </button>
        </div>

        <div className="fade-up-4" style={{ display: "flex", justifyContent: "center", gap: "clamp(20px, 5vw, 56px)", flexWrap: "wrap" }}>
          {[["🏘️", "50+", "Properties"], ["👥", "200+", "Tenants"], ["⭐", "4.8", "Rating"], ["🇿🇼", "5", "Cities"]].map(([icon, val, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22 }}>{icon}</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: "#F4A228" }}>{val}</div>
              <div style={{ fontSize: 12, color: "#8899AA" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "60px 24px", maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", textAlign: "center", color: "#F0F4F8", fontSize: 30, marginBottom: 8 }}>How RentEasy Works</h2>
        <p style={{ textAlign: "center", color: "#8899AA", marginBottom: 40 }}>Simple. Transparent. Affordable.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {[
            ["1", "🏠", "Landlord Lists", "Post your property for free in minutes. Add photos, price and amenities."],
            ["2", "🔍", "Tenant Browses", "Search by city, price, bedrooms. Filter to find exactly what you need."],
            ["3", "💳", "Pay Small Fee", "Tenant pays a small viewing fee ($5–$20) to unlock contact details."],
            ["4", "🤝", "Connect & Move In", "Contact the landlord directly. Arrange a viewing. Secure your new home!"],
          ].map(([num, icon, title, desc]) => (
            <div key={num} style={{ background: "#112236", border: "1px solid #1E3A5F", borderRadius: 16, padding: "28px 22px", textAlign: "center", transition: "border-color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#F4A228"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#1E3A5F"}>
              <div style={{ background: "#F4A228", color: "#0D1B2A", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, margin: "0 auto 12px" }}>{num}</div>
              <div style={{ fontSize: 36, marginBottom: 10 }}>{icon}</div>
              <h3 style={{ color: "#F4A228", fontWeight: 700, marginBottom: 8 }}>{title}</h3>
              <p style={{ color: "#8899AA", fontSize: 13, lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 24px 60px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#F0F4F8", fontSize: 26 }}>Featured Properties</h2>
          <button className="btn-outline" onClick={() => goTo("listings", "tenant")}>View All →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 18 }}>
          {PROPERTIES.slice(0, 3).map(p => (
            <PropertyCard key={p.id} property={p} saved={savedProperties.includes(p.id)}
              onSave={() => setSavedProperties(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])}
              onClick={() => { setSelectedProperty(p); goTo("detail", "tenant"); }} />
          ))}
        </div>
      </div>

      <Footer goTo={goTo} />
    </div>
  );

  // ── LISTINGS ──────────────────────────────────────────────────────────────
  if (page === "listings") return (
    <div style={{ minHeight: "100vh", background: "#0D1B2A" }}>
      {notification && <Notification data={notification} />}
      <Nav page={page} role={role} goTo={goTo} saved={savedProperties.length}
        mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      <div style={{ padding: "32px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div className="fade-up" style={{ marginBottom: 24 }}>
          <h1 className="section-title">Browse Properties</h1>
          <p style={{ color: "#8899AA", fontSize: 14 }}>
            Find your next home across Zimbabwe
            {firstTime && <span style={{ marginLeft: 10, background: "linear-gradient(135deg,#F4A228,#f5c85a)", color: "#0D1B2A", borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 700 }}>🎉 First unlock FREE</span>}
          </p>
        </div>

        <div className="fade-up-1" style={{ background: "#112236", border: "1px solid #1E3A5F", borderRadius: 16, padding: "20px 24px", marginBottom: 28 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ fontSize: 12, color: "#8899AA", display: "block", marginBottom: 5 }}>🔍 Search</label>
              <input placeholder="Location, city, or property name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#8899AA", display: "block", marginBottom: 5 }}>City</label>
              <select value={filterCity} onChange={e => setFilterCity(e.target.value)}>
                {["All", "Harare", "Bulawayo", "Mutare", "Gweru"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#8899AA", display: "block", marginBottom: 5 }}>Type</label>
              <select value={filterType} onChange={e => setFilterType(e.target.value)}>
                {["All", "House", "Flat", "Townhouse", "Studio"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#8899AA", display: "block", marginBottom: 5 }}>Min Bedrooms</label>
              <select value={filterBeds} onChange={e => setFilterBeds(e.target.value)}>
                {["Any", "1", "2", "3", "4"].map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#8899AA", display: "block", marginBottom: 5 }}>Max Rent: <strong style={{ color: "#F4A228" }}>${filterMax}/mo</strong></label>
              <input type="range" min={100} max={1500} step={50} value={filterMax}
                onChange={e => setFilterMax(Number(e.target.value))}
                style={{ background: "transparent", border: "none", padding: "8px 0", accentColor: "#F4A228" }} />
            </div>
          </div>
        </div>

        <p style={{ color: "#8899AA", fontSize: 13, marginBottom: 20 }}>
          Showing <strong style={{ color: "#F4A228" }}>{filteredProps.length}</strong> {filteredProps.length === 1 ? "property" : "properties"}
        </p>

        {filteredProps.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <p style={{ color: "#8899AA" }}>No properties match your filters. Try adjusting your search.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 22 }}>
            {filteredProps.map((p, i) => (
              <div key={p.id} className={`fade-up-${Math.min(i + 1, 4)}`}>
                <PropertyCard property={p} saved={savedProperties.includes(p.id)}
                  onSave={() => setSavedProperties(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])}
                  onClick={() => { setSelectedProperty(p); goTo("detail"); }} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ── DETAIL ────────────────────────────────────────────────────────────────
  if (page === "detail" && selectedProperty) {
    const prop = selectedProperty;
    const unlocked = paidProperties.includes(prop.id);
    const feeDisplay = firstTime ? "FREE" : `$${prop.viewingFee}`;

    return (
      <div style={{ minHeight: "100vh", background: "#0D1B2A" }}>
        {notification && <Notification data={notification} />}
        <Nav page="listings" role={role} goTo={goTo} saved={savedProperties.length}
          mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
        <div style={{ padding: "28px 24px", maxWidth: 760, margin: "0 auto" }}>
          <button className="btn-ghost" onClick={() => goTo("listings")} style={{ marginBottom: 22 }}>← Back to listings</button>

          <div className="fade-up" style={{ background: "#112236", border: "1px solid #1E3A5F", borderRadius: 20, overflow: "hidden" }}>
            <div style={{ position: "relative" }}>
              <PhotoGallery photos={prop.photos} emoji={prop.emoji} />
              <div style={{ position: "absolute", top: 16, right: 16, display: "flex", gap: 8 }}>
                <span className="badge" style={{ background: prop.available ? "#22C55E" : "#6B7280", color: "#fff" }}>
                  {prop.available ? "✓ Available" : "Taken"}
                </span>
              </div>
              <button onClick={() => setSavedProperties(prev => prev.includes(prop.id) ? prev.filter(x => x !== prop.id) : [...prev, prop.id])}
                style={{ position: "absolute", top: 16, left: 16, background: "rgba(0,0,0,0.4)", border: "none", borderRadius: "50%", width: 38, height: 38, cursor: "pointer", fontSize: 20 }}>
                {savedProperties.includes(prop.id) ? "❤️" : "🤍"}
              </button>
            </div>

            <div style={{ padding: "28px 32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6, flexWrap: "wrap", gap: 12 }}>
                <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#F4A228", fontSize: 24 }}>{prop.title}</h1>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: "#F4A228" }}>${prop.price}</div>
                  <div style={{ fontSize: 12, color: "#8899AA" }}>per month</div>
                </div>
              </div>
              <p style={{ color: "#8899AA", marginBottom: 16 }}>📍 {prop.location} · Posted {prop.posted}</p>

              <div style={{ display: "flex", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
                {[["🛏", prop.bedrooms, "Beds"], ["🚿", prop.bathrooms, "Baths"], ["🏠", prop.type, "Type"], ["💳", feeDisplay, "View Fee"]].map(([icon, val, lbl]) => (
                  <div key={lbl} style={{ background: "#081422", borderRadius: 12, padding: "12px 16px", textAlign: "center", flex: 1, minWidth: 70 }}>
                    <div style={{ fontSize: 20 }}>{icon}</div>
                    <div style={{ fontWeight: 700, color: "#F4A228", fontSize: 16 }}>{val}</div>
                    <div style={{ fontSize: 11, color: "#8899AA" }}>{lbl}</div>
                  </div>
                ))}
              </div>

              <p style={{ color: "#CBD5E1", lineHeight: 1.75, marginBottom: 20 }}>{prop.description}</p>

              <div style={{ marginBottom: 24 }}>
                <h3 style={{ color: "#2DD4BF", fontSize: 14, fontWeight: 700, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Amenities</h3>
                <div>{prop.amenities.map(a => <span key={a} className="tag">✓ {a}</span>)}</div>
              </div>

              <div style={{ background: "#081422", border: "1px solid #1E3A5F", borderRadius: 14, padding: "18px 20px", marginBottom: 24 }}>
                <h3 style={{ color: "#2DD4BF", fontSize: 13, fontWeight: 700, marginBottom: 14, textTransform: "uppercase", letterSpacing: 1 }}>Listed By</h3>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ background: "#F4A228", color: "#0D1B2A", borderRadius: "50%", width: 46, height: 46, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, flexShrink: 0 }}>{prop.landlord.initials}</div>
                    <div>
                      <div style={{ fontWeight: 700, color: "#F0F4F8" }}>{prop.landlord.name}</div>
                      <div style={{ color: "#8899AA", fontSize: 13 }}>⭐ {prop.landlord.rating} · {prop.landlord.properties} listings</div>
                    </div>
                  </div>
                  {unlocked ? (
                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: "#22C55E", fontWeight: 700 }}>📞 {prop.landlord.phone}</div>
                      <div style={{ color: "#2DD4BF", fontSize: 13, marginTop: 2 }}>📧 {prop.landlord.email}</div>
                    </div>
                  ) : (
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 22 }}>🔒</div>
                      <div style={{ color: "#8899AA", fontSize: 12 }}>Pay to unlock</div>
                    </div>
                  )}
                </div>
              </div>

              {prop.available && !unlocked && (
                <div style={{ background: "linear-gradient(135deg, #1a3a5c, #112236)", border: "2px solid #F4A228", borderRadius: 16, padding: "24px", textAlign: "center" }}>
                  {firstTime && (
                    <div style={{ display: "inline-block", background: "linear-gradient(135deg,#F4A228,#f5c85a)", color: "#0D1B2A", borderRadius: 20, padding: "6px 18px", fontWeight: 700, fontSize: 13, marginBottom: 12 }}>
                      🎉 Your first unlock is completely FREE!
                    </div>
                  )}
                  <h3 style={{ fontFamily: "'Playfair Display', serif", color: "#F4A228", fontSize: 20, marginBottom: 8 }}>Request a Viewing</h3>
                  <p style={{ color: "#8899AA", fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
                    {firstTime
                      ? "Unlock this landlord's contact details for free — no payment needed for your first unlock."
                      : <>Pay a once-off viewing fee of <strong style={{ color: "#F4A228" }}>${prop.viewingFee} USD</strong> to instantly unlock the landlord's contact details.</>}
                  </p>
                  <button className="btn-primary" style={{ fontSize: 16, padding: "14px 36px" }} onClick={() => setPayModal(true)}>
                    {firstTime ? "🔓 Unlock Contact for FREE →" : `Pay $${prop.viewingFee} to Unlock Contact →`}
                  </button>
                  <p style={{ color: "#4a6070", fontSize: 11, marginTop: 10 }}>🔒 Secure · Instant unlock · EcoCash / InnBucks / Card</p>
                </div>
              )}

              {unlocked && (
                <div style={{ background: "#071a0e", border: "2px solid #22C55E", borderRadius: 16, padding: "24px", textAlign: "center" }}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
                  <h3 style={{ color: "#22C55E", fontFamily: "'Playfair Display', serif", fontSize: 20, marginBottom: 6 }}>Contact Unlocked!</h3>
                  <p style={{ color: "#CBD5E1", fontSize: 14, marginBottom: 12 }}>Contact <strong>{prop.landlord.name}</strong> directly to arrange your viewing.</p>
                  <div style={{ color: "#F4A228", fontSize: 18, fontWeight: 700 }}>📞 {prop.landlord.phone}</div>
                  <div style={{ color: "#2DD4BF", fontSize: 15, marginTop: 6 }}>📧 {prop.landlord.email}</div>
                </div>
              )}

              {!prop.available && (
                <div style={{ background: "#1a1a2e", border: "2px solid #6B7280", borderRadius: 16, padding: "24px", textAlign: "center" }}>
                  <p style={{ color: "#8899AA" }}>This property is currently not available. Check back later or browse similar listings.</p>
                  <button className="btn-outline" style={{ marginTop: 14 }} onClick={() => goTo("listings")}>Browse More →</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {payModal && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: "#F4A228", fontSize: 22, marginBottom: 6 }}>
                {firstTime ? "🎉 Free Unlock" : "💳 Viewing Fee Payment"}
              </h3>
              <p style={{ color: "#8899AA", fontSize: 14, marginBottom: 20 }}>
                Unlock contact details for <strong style={{ color: "#F0F4F8" }}>{prop.title}</strong>
              </p>

              <div style={{ background: "#081422", borderRadius: 12, padding: "16px 20px", marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ color: "#8899AA" }}>Viewing fee</span>
                  <span style={{ fontWeight: 700, textDecoration: firstTime ? "line-through" : "none", color: firstTime ? "#8899AA" : "#F0F4F8" }}>${prop.viewingFee}.00</span>
                </div>
                {firstTime && (
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ color: "#F4A228", fontWeight: 600 }}>First-time discount</span>
                    <span style={{ color: "#22C55E", fontWeight: 700 }}>-${prop.viewingFee}.00</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #1E3A5F", paddingTop: 10, marginTop: 4 }}>
                  <span style={{ color: "#8899AA" }}>Total due</span>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#F4A228", fontWeight: 700 }}>
                    {firstTime ? "FREE" : `$${prop.viewingFee}.00 USD`}
                  </span>
                </div>
              </div>

              {!firstTime && (
                <>
                  <label style={{ fontSize: 12, color: "#8899AA", display: "block", marginBottom: 8 }}>Payment Method</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
                    {[["📱", "EcoCash"], ["💰", "InnBucks"], ["💳", "Card"]].map(([icon, m]) => (
                      <div key={m} onClick={() => setPayMethod(m)}
                        style={{ background: payMethod === m ? "rgba(244,162,40,0.15)" : "#081422", border: `2px solid ${payMethod === m ? "#F4A228" : "#1E3A5F"}`, borderRadius: 10, padding: "12px 8px", textAlign: "center", cursor: "pointer", transition: "all 0.2s" }}>
                        <div style={{ fontSize: 22 }}>{icon}</div>
                        <div style={{ fontSize: 12, color: payMethod === m ? "#F4A228" : "#8899AA", fontWeight: 600, marginTop: 4 }}>{m}</div>
                      </div>
                    ))}
                  </div>
                  {payMethod === "EcoCash" && <div style={{ background: "#081422", borderRadius: 8, padding: "12px", marginBottom: 16, fontSize: 13, color: "#8899AA" }}>📱 Dial *151# and pay to <strong style={{ color: "#F4A228" }}>RentEasy *151*2*1#</strong></div>}
                  {payMethod === "InnBucks" && <div style={{ background: "#081422", borderRadius: 8, padding: "12px", marginBottom: 16, fontSize: 13, color: "#8899AA" }}>💰 Send payment to <strong style={{ color: "#F4A228" }}>RentEasy Zimbabwe</strong> on InnBucks</div>}
                  {payMethod === "Card" && (
                    <div style={{ marginBottom: 16 }}>
                      <input placeholder="Card number" style={{ marginBottom: 10 }} />
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <input placeholder="MM / YY" />
                        <input placeholder="CVV" />
                      </div>
                    </div>
                  )}
                </>
              )}

              <div style={{ display: "flex", gap: 12 }}>
                <button className="btn-primary" style={{ flex: 1, padding: "13px" }} onClick={handlePayViewing}>
                  {firstTime ? "🔓 Unlock for FREE" : `Confirm Payment $${prop.viewingFee}`}
                </button>
                <button className="btn-ghost" onClick={() => setPayModal(false)}>Cancel</button>
              </div>
              <p style={{ color: "#4a6070", fontSize: 11, textAlign: "center", marginTop: 12 }}>
                {firstTime ? "🎉 First-time users unlock one contact for free" : "🔒 Secure payment · Contact unlocked instantly · No refunds"}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── SAVED ─────────────────────────────────────────────────────────────────
  if (page === "saved") return (
    <div style={{ minHeight: "100vh", background: "#0D1B2A" }}>
      {notification && <Notification data={notification} />}
      <Nav page={page} role={role} goTo={goTo} saved={savedProperties.length}
        mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <div style={{ padding: "32px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <h1 className="section-title fade-up">❤️ Saved Properties</h1>
        <p style={{ color: "#8899AA", marginBottom: 28 }}>{savedProperties.length} saved</p>
        {savedProperties.length === 0 ? (
          <div style={{ background: "#112236", border: "1px solid #1E3A5F", borderRadius: 16, padding: "60px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🤍</div>
            <p style={{ color: "#8899AA", marginBottom: 20 }}>No saved properties yet. Browse listings and tap the heart icon.</p>
            <button className="btn-primary" onClick={() => goTo("listings")}>Browse Properties →</button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 22 }}>
            {PROPERTIES.filter(p => savedProperties.includes(p.id)).map(p => (
              <PropertyCard key={p.id} property={p} saved={true}
                onSave={() => setSavedProperties(prev => prev.filter(x => x !== p.id))}
                onClick={() => { setSelectedProperty(p); goTo("detail"); }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ── LANDLORD ──────────────────────────────────────────────────────────────
  if (page === "landlord") return (
    <div style={{ minHeight: "100vh", background: "#0D1B2A" }}>
      {notification && <Notification data={notification} />}
      <Nav page={page} role={role} goTo={goTo} saved={savedProperties.length}
        mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      <div style={{ padding: "32px 24px", maxWidth: 920, margin: "0 auto" }}>
        <div className="fade-up" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 className="section-title">Landlord Dashboard</h1>
            <p style={{ color: "#8899AA" }}>Manage your property listings</p>
          </div>
          <button className="btn-primary" onClick={() => setListingModal(true)}>+ List New Property</button>
        </div>

        <div className="fade-up-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 32 }}>
          {[["📋", landlordListings.length || "0", "Listed"], ["👁️", "24", "Views this week"], ["📩", "5", "View requests"], ["💵", `$${landlordListings.length * 5 + 45}`, "Fees received"]].map(([icon, val, lbl]) => (
            <div key={lbl} className="stat-card">
              <div style={{ fontSize: 30, marginBottom: 6 }}>{icon}</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: "#F4A228", fontWeight: 700 }}>{val}</div>
              <div style={{ fontSize: 12, color: "#8899AA" }}>{lbl}</div>
            </div>
          ))}
        </div>

        <div className="fade-up-2">
          <h2 style={{ color: "#F0F4F8", fontWeight: 700, marginBottom: 16, fontSize: 18 }}>Your Listings</h2>
          {landlordListings.length === 0 ? (
            <div style={{ background: "#112236", border: "2px dashed #1E3A5F", borderRadius: 16, padding: "48px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🏠</div>
              <p style={{ color: "#8899AA", marginBottom: 20 }}>No properties listed yet. Add your first property to get started.</p>
              <button className="btn-primary" onClick={() => setListingModal(true)}>List Your First Property</button>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 14 }}>
              {landlordListings.map((l, i) => (
                <div key={i} style={{ background: "#112236", border: "1px solid #1E3A5F", borderRadius: 14, padding: "16px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                    {l.photos && l.photos.length > 0
                      ? <img src={l.photos[0]} alt={l.title} style={{ width: 52, height: 52, borderRadius: 10, objectFit: "cover" }} />
                      : <span style={{ fontSize: 32 }}>🏠</span>}
                    <div>
                      <div style={{ fontWeight: 700 }}>{l.title}</div>
                      <div style={{ color: "#8899AA", fontSize: 13 }}>📍 {l.location} · {l.type} · ${l.price}/mo</div>
                      {l.photos && l.photos.length > 0 && <div style={{ color: "#2DD4BF", fontSize: 12, marginTop: 2 }}>📷 {l.photos.length} photo{l.photos.length > 1 ? "s" : ""}</div>}
                    </div>
                  </div>
                  <span className="badge" style={{ background: "#22C55E", color: "#fff" }}>✓ Active</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="fade-up-3" style={{ marginTop: 32, background: "#081422", border: "1px solid #1E3A5F", borderRadius: 16, padding: "22px 24px" }}>
          <h3 style={{ color: "#2DD4BF", marginBottom: 16, fontWeight: 700 }}>📬 Viewing Requests <span className="badge" style={{ background: "#F4A228", color: "#0D1B2A", marginLeft: 8 }}>5 pending</span></h3>
          {[
            { tenant: "T. Mutasa", property: "3-Bed Borrowdale", time: "Today, 2:00 PM", fee: "$10", status: "Paid" },
            { tenant: "R. Chikomo", property: "Studio Belgravia", time: "Tomorrow, 10:00 AM", fee: "$5", status: "Paid" },
            { tenant: "N. Sibanda", property: "2-Bed Avondale", time: "Thu 9 Apr, 3:00 PM", fee: "$5", status: "Paid" },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #1E3A5F", paddingTop: 14, marginTop: 14, flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 700 }}>{r.tenant}</div>
                <div style={{ color: "#8899AA", fontSize: 13 }}>🏠 {r.property} · 🕐 {r.time}</div>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span className="badge" style={{ background: "#22C55E", color: "#fff" }}>{r.fee} {r.status}</span>
                <button className="btn-primary" style={{ padding: "8px 16px", fontSize: 13 }}>Confirm</button>
                <button className="btn-ghost" style={{ padding: "8px 14px", fontSize: 13 }}>Decline</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {listingModal && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxHeight: "90vh", overflowY: "auto" }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", color: "#F4A228", fontSize: 22, marginBottom: 20 }}>📋 List a New Property</h3>
            <div style={{ display: "grid", gap: 14 }}>
              {[["Property Title *", "title", "e.g. Modern 3-Bedroom House"], ["Location *", "location", "e.g. Borrowdale, Harare"], ["Monthly Rent (USD) *", "price", "e.g. 750"], ["Bedrooms", "bedrooms", "e.g. 3"], ["Bathrooms", "bathrooms", "e.g. 2"]].map(([lbl, field, ph]) => (
                <div key={field}>
                  <label style={{ fontSize: 12, color: "#8899AA", display: "block", marginBottom: 5 }}>{lbl}</label>
                  <input placeholder={ph} value={newListing[field]} onChange={e => setNewListing(p => ({ ...p, [field]: e.target.value }))} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 12, color: "#8899AA", display: "block", marginBottom: 5 }}>City</label>
                <select value={newListing.city} onChange={e => setNewListing(p => ({ ...p, city: e.target.value }))}>
                  {["Harare", "Bulawayo", "Mutare", "Gweru", "Masvingo"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#8899AA", display: "block", marginBottom: 5 }}>Property Type</label>
                <select value={newListing.type} onChange={e => setNewListing(p => ({ ...p, type: e.target.value }))}>
                  {["House", "Flat", "Townhouse", "Studio", "Commercial"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#8899AA", display: "block", marginBottom: 5 }}>Description</label>
                <textarea rows={3} placeholder="Describe the property..." value={newListing.description} onChange={e => setNewListing(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#8899AA", display: "block", marginBottom: 5 }}>Amenities (comma-separated)</label>
                <input placeholder="e.g. Borehole, Parking, Security, Garden" value={newListing.amenities} onChange={e => setNewListing(p => ({ ...p, amenities: e.target.value }))} />
              </div>
              <PhotoUploader photos={newListingPhotos} setPhotos={setNewListingPhotos} />
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <button className="btn-primary" style={{ flex: 1, padding: "13px" }} onClick={handleListingSubmit}>Submit Listing ✓</button>
              <button className="btn-ghost" onClick={() => { setListingModal(false); setNewListingPhotos([]); }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return null;
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function Nav({ page, role, goTo, saved, mobileMenuOpen, setMobileMenuOpen }) {
  return (
    <nav style={{ background: "#112236", borderBottom: "2px solid #F4A228", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, position: "sticky", top: 0, zIndex: 100 }}>
      <div onClick={() => goTo("home", null)} style={{ cursor: "pointer", userSelect: "none" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#F4A228", lineHeight: 1 }}>RentEasy</div>
        <div style={{ fontSize: 10, color: "#2DD4BF", letterSpacing: 3, fontWeight: 600 }}>ZIMBABWE</div>
      </div>
      <div className="hide-mobile" style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <NavBtn active={page === "listings"} onClick={() => goTo("listings", "tenant")}>Browse</NavBtn>
        <NavBtn active={page === "saved"} onClick={() => goTo("saved", "tenant")}>
          Saved {saved > 0 && <span style={{ background: "#F4A228", color: "#0D1B2A", borderRadius: "50%", width: 18, height: 18, fontSize: 10, fontWeight: 800, display: "inline-flex", alignItems: "center", justifyContent: "center", marginLeft: 4 }}>{saved}</span>}
        </NavBtn>
        <NavBtn active={page === "landlord"} onClick={() => goTo("landlord", "landlord")}>Landlord</NavBtn>
      </div>
      <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        style={{ display: "none", background: "none", border: "none", color: "#F4A228", fontSize: 26, cursor: "pointer" }}
        className="show-mobile">☰</button>
    </nav>
  );
}

function NavBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{ background: active ? "#F4A228" : "transparent", color: active ? "#0D1B2A" : "#F0F4F8", border: `1.5px solid ${active ? "#F4A228" : "#1E3A5F"}`, borderRadius: 8, padding: "7px 16px", cursor: "pointer", fontSize: 13, fontWeight: active ? 700 : 500, fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", transition: "all 0.2s" }}>
      {children}
    </button>
  );
}

function PropertyCard({ property: p, saved, onSave, onClick }) {
  return (
    <div className="property-card" style={{ background: "#112236", border: "1px solid #1E3A5F", borderRadius: 16, overflow: "hidden" }}>
      <div style={{ height: 110, position: "relative", overflow: "hidden" }}>
        {p.photos && p.photos.length > 0 ? (
          <>
            <img src={p.photos[0]} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            {p.photos.length > 1 && (
              <span style={{ position: "absolute", bottom: 6, right: 8, background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: 11, padding: "2px 8px", borderRadius: 12 }}>📷 {p.photos.length}</span>
            )}
          </>
        ) : (
          <div style={{ background: "linear-gradient(135deg, #1a3a5c, #0f2a45)", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 56 }}>{p.emoji}</span>
          </div>
        )}
        <span className="badge" style={{ position: "absolute", top: 10, right: 10, background: p.available ? "#22C55E" : "#6B7280", color: "#fff" }}>
          {p.available ? "Available" : "Taken"}
        </span>
        <button onClick={e => { e.stopPropagation(); onSave(); }}
          style={{ position: "absolute", top: 8, left: 10, background: "rgba(0,0,0,0.35)", border: "none", borderRadius: "50%", width: 34, height: 34, cursor: "pointer", fontSize: 17 }}>
          {saved ? "❤️" : "🤍"}
        </button>
      </div>
      <div style={{ padding: "16px 18px" }}>
        <h3 style={{ color: "#F0F4F8", fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{p.title}</h3>
        <p style={{ color: "#8899AA", fontSize: 13, marginBottom: 10 }}>📍 {p.location}</p>
        <div style={{ marginBottom: 12 }}>
          <span className="tag">🛏 {p.bedrooms} bed</span>
          <span className="tag">🚿 {p.bathrooms} bath</span>
          <span className="tag">{p.type}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#F4A228" }}>${p.price}</span>
            <span style={{ color: "#8899AA", fontSize: 12 }}>/mo</span>
          </div>
          <button className="btn-primary" style={{ padding: "8px 18px" }} onClick={onClick}>Details</button>
        </div>
      </div>
    </div>
  );
}

function Notification({ data }) {
  return (
    <div className="notification" style={{ background: data.type === "error" ? "#EF4444" : "#22C55E", color: "#fff" }}>
      {data.msg}
    </div>
  );
}

function Footer({ goTo }) {
  return (
    <footer style={{ background: "#081422", borderTop: "1px solid #1E3A5F", padding: "40px 24px", textAlign: "center" }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: "#F4A228", fontWeight: 700, marginBottom: 4 }}>RentEasy Zimbabwe</div>
      <p style={{ color: "#8899AA", fontSize: 13, marginBottom: 20 }}>Connecting landlords and tenants across Zimbabwe</p>
      <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap", marginBottom: 20 }}>
        {[["Browse Properties", "listings"], ["List a Property", "landlord"], ["Saved Homes", "saved"]].map(([lbl, pg]) => (
          <button key={pg} onClick={() => goTo(pg)} style={{ background: "none", border: "none", color: "#8899AA", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}
            onMouseEnter={e => e.target.style.color = "#F4A228"}
            onMouseLeave={e => e.target.style.color = "#8899AA"}>{lbl}</button>
        ))}
      </div>
      <p style={{ color: "#4a6070", fontSize: 12 }}>© 2026 RentEasy Zimbabwe · Built to connect Zimbabwe's rental market</p>
    </footer>
  );
}

// ─── MOUNT ────────────────────────────────────────────────────────────────────
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
