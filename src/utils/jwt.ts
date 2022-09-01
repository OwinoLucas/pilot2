const jwt = require('jsonwebtoken');
const APP_SECRET = 'GraphQL-is-aw3some';

function getTokenPayload(token: any) {
  return jwt.verify(token, APP_SECRET);
}

function getUserId(req: any, authToken: any) {
    if (req) {
      const authHeader = req.headers.get('Authorization');
      console.log(authHeader)
      if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        if (!token) {
          throw new Error('No token found');
        }
        const { userId } = getTokenPayload(token);
        return userId;
      }
    } else if (authToken) {
      const { userId } = getTokenPayload(authToken);
      return userId;
    }
  
    //throw new Error('Not authenticated');
}


export  {
    APP_SECRET,
    getUserId,
  };