const Footer = () => (
  <footer className="bg-dark-900 text-gray-400 py-10 mt-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <span className="text-2xl font-bold text-white flex items-center gap-2">🍽️ Campus Canteen</span>
          <p className="mt-3 text-sm">Your college canteen, now digital. Order food, get invoices, and skip the queue!</p>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-primary-400 transition-colors">Home</a></li>
            <li><a href="/menu" className="hover:text-primary-400 transition-colors">Menu</a></li>
            <li><a href="/my-orders" className="hover:text-primary-400 transition-colors">My Orders</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-3">Canteen Info</h3>
          <ul className="space-y-2 text-sm">
            <li>🏫 College Campus, Main Building</li>
            <li>🕐 Mon-Sat: 8:00 AM - 8:00 PM</li>
            <li>📞 Contact canteen staff for help</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Campus Canteen. Built for College Hackathon.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
