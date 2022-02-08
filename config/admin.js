module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '1d26cf9b97efac6865da40917553aec7'),
  },
});
