const fs = require('fs')
const path = require('path')

const config = [
  { name: 'Service', plural: 'Services', field: 'price', model: 'service', bookingModel: 'serviceBooking' },
  { name: 'Worker', plural: 'Workers', field: 'hourlyRate', model: 'worker', bookingModel: 'workerBooking' },
  { name: 'Offer', plural: 'Offers', field: 'discountPrice', model: 'offer', bookingModel: 'offerOrder' },
  { name: 'Event', plural: 'Events', field: 'ticketPrice', model: 'event', bookingModel: 'eventRegistration' },
  { name: 'MarketplaceItem', plural: 'Marketplace', field: 'itemPrice', model: 'marketplaceItem', bookingModel: 'marketplaceOrder' }
]

// 1. Generate Backend Routes
const routesDir = path.join(__dirname, 'backend', 'src', 'routes')
const rentalRouteContent = fs.readFileSync(path.join(routesDir, 'rentals.routes.js'), 'utf-8')
const bookingRouteContent = fs.readFileSync(path.join(routesDir, 'bookings.routes.js'), 'utf-8')

for (const c of config) {
  // Replace in item route
  let itemCode = rentalRouteContent
    .replace(/rentals/g, c.plural.toLowerCase())
    .replace(/rental/g, c.model)
    .replace(/Rental/g, c.name)
    .replace(/rentPrice/g, c.field)
  fs.writeFileSync(path.join(routesDir, `${c.plural.toLowerCase()}.routes.js`), itemCode)

  // Replace in booking route
  let bookCode = bookingRouteContent
    .replace(/bookings/g, `${c.plural.toLowerCase()}-bookings`)
    .replace(/booking/g, c.bookingModel)
    .replace(/Booking/g, c.bookingModel.charAt(0).toUpperCase() + c.bookingModel.slice(1))
    .replace(/rental/g, c.model)
    .replace(/Rental/g, c.name)
  fs.writeFileSync(path.join(routesDir, `${c.plural.toLowerCase()}_bookings.routes.js`), bookCode)
}

// Update app.js
let appJs = fs.readFileSync(path.join(__dirname, 'backend', 'src', 'app.js'), 'utf-8')
for (const c of config) {
  const mountRoute = c.plural.toLowerCase()
  if (!appJs.includes(`require('./routes/${mountRoute}.routes')`)) {
     appJs = appJs.replace(`const rentalRoutes = require('./routes/rentals.routes')`, `const rentalRoutes = require('./routes/rentals.routes')\nconst ${mountRoute}Routes = require('./routes/${mountRoute}.routes')\nconst ${mountRoute}BookingsRoutes = require('./routes/${mountRoute}_bookings.routes')`)
     appJs = appJs.replace(`app.use('/api/rentals', rentalRoutes)`, `app.use('/api/rentals', rentalRoutes)\napp.use('/api/${mountRoute}', ${mountRoute}Routes)\napp.use('/api/${mountRoute}-bookings', ${mountRoute}BookingsRoutes)`)
  }
}
fs.writeFileSync(path.join(__dirname, 'backend', 'src', 'app.js'), appJs)

// 2. Generate Frontend Pages
const pagesDir = path.join(__dirname, 'frontend', 'src', 'pages')
const ownerRentalsPage = fs.readFileSync(path.join(pagesDir, 'OwnerRentalsPage.tsx'), 'utf-8')
const ownerBookingsPage = fs.readFileSync(path.join(pagesDir, 'OwnerBookingsPage.tsx'), 'utf-8')

for (const c of config) {
  // Dashboard Page (similar to Rentals Page)
  let dashCode = ownerRentalsPage
    .replace(/OwnerRentalsPage/g, `Owner${c.plural}Page`)
    .replace(/Rentals Dashboard/g, `${c.plural} Dashboard`)
    .replace(/rentals/g, c.plural.toLowerCase())
    .replace(/rental/g, c.model)
    .replace(/Rental/g, c.name)
    .replace(/rentPrice/g, c.field)
    .replace(/Rent Price/g, c.field.replace(/([A-Z])/g, ' $1').trim())
    .replace(/Rent/g, c.name)

  fs.writeFileSync(path.join(pagesDir, `Owner${c.plural}Page.tsx`), dashCode)

  // Bookings Page
  let bookCode = ownerBookingsPage
    .replace(/OwnerBookingsPage/g, `Owner${c.plural}BookingsPage`)
    .replace(/Booking/g, c.bookingModel.charAt(0).toUpperCase() + c.bookingModel.slice(1))
    .replace(/bookings/g, `${c.plural.toLowerCase()}-bookings`)
    .replace(/booking/g, c.bookingModel)
    .replace(/rental/g, c.model)
    .replace(/Rental/g, c.name)
  fs.writeFileSync(path.join(pagesDir, `Owner${c.plural}BookingsPage.tsx`), bookCode)
}

// Update App.tsx
let appTsx = fs.readFileSync(path.join(__dirname, 'frontend', 'src', 'App.tsx'), 'utf-8')
for (const c of config) {
  if (!appTsx.includes(`Owner${c.plural}Page`)) {
    appTsx = appTsx.replace(`import { OwnerRentalsPage } from './pages/OwnerRentalsPage'`, `import { OwnerRentalsPage } from './pages/OwnerRentalsPage'\nimport { Owner${c.plural}Page } from './pages/Owner${c.plural}Page'\nimport { Owner${c.plural}BookingsPage } from './pages/Owner${c.plural}BookingsPage'`)
    
    appTsx = appTsx.replace(`<Route path="rentals" element={<OwnerRentalsPage />} />`, `<Route path="rentals" element={<OwnerRentalsPage />} />\n          <Route path="${c.plural.toLowerCase()}-dashboard" element={<Owner${c.plural}Page />} />\n          <Route path="${c.plural.toLowerCase()}" element={<Owner${c.plural}Page />} />\n          <Route path="${c.plural.toLowerCase()}-bookings" element={<Owner${c.plural}BookingsPage />} />`)
  }
}
fs.writeFileSync(path.join(__dirname, 'frontend', 'src', 'App.tsx'), appTsx)

console.log("Scaffolding Complete!")
