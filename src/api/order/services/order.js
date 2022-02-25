const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::order.order", ({ strapi }) => ({
  // Method 3: Replacing a core service
  async findOneBySession(session) {
    const { results } = await strapi.service("api::order.order").find();

    const filtered = results.filter(
      (item) => item.checkout_session === session
    );

    return filtered;
  },
}));
