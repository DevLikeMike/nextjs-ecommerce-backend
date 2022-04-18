module.exports = {
  routes: [
    {
      // Use custom Route for custom handler strapi v4
      method: "POST",
      path: "/orders/confirm",
      handler: "order.confirm",
    },
    {
      method: "GET",
      path: "/orders/userOrders",
      handler: "order.userOrders",
    },
  ],
};
