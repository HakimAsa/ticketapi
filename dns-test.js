const dns = require('dns')

dns.lookup('db.fwrbaibdrkijvhxbthcq.supabase.co', (err, address) => {
  if (err) {
    console.error('DNS lookup failed:', err.message)
  } else {
    console.log('DNS resolved to:', address)
  }
})
