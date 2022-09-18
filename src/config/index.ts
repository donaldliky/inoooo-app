// const BACKEND_URL = "http://localhost:53134";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || ''
// const BACKEND_URL = 'https://inooooapp.herokuapp.com'
// const BACKEND_URL = "http://54.248.54.248:53134";
// vps
// const DISCORD_REDIRECT_URL = 'https://discord.com/api/oauth2/authorize?client_id=1001787144362274848&redirect_uri=http%3A%2F%2F54.248.54.248%3A53134&response_type=token&scope=identify';
// localhost
// const DISCORD_REDIRECT_URL = 'https://discord.com/api/oauth2/authorize?client_id=1001787144362274848&redirect_uri=http%3A%2F%2Flocalhost%3A53134&response_type=token&scope=identify';
// heroku
const DISCORD_REDIRECT_URL = process.env.REACT_APP_DISCORD_REDIRECT_URL || ''
const DISCORD_API_URL = process.env.REACT_APP_DISCORD_API_URL || ''
const DISCORD_AVATAR_BASEURL = process.env.REACT_APP_DISCORD_AVATAR_BASEURL || ''
const CLUSTER_API = process.env.REACT_APP_CLUSTER_API || 'https://api.metaplex.solana.com'

export {
  BACKEND_URL,
  DISCORD_REDIRECT_URL,
  CLUSTER_API,
  DISCORD_API_URL,
  DISCORD_AVATAR_BASEURL
}    