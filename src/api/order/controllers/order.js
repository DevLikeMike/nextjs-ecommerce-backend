"use strict";
const { sanitizeEntity } = require("strapi-utils");
const stripe = require("stripe")(process.env.STRIPE_SK);

const fromDecimalToInt = (number) => parseInt(number * 100);

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  // Get only orders that belong to user
  //   async find(ctx) {
  //     const user = ctx.state.user;

  //     let entities;
  //     if (ctx.query._q) {
  //       entities = await strapi.service("api::order.order").search({
  //         ...ctx.query,
  //         user: user.id,
  //       });
  //     } else {
  //       entities = await strapi.service("api::order.order").find({
  //         ...ctx.query,
  //         user: user.id,
  //       });
  //     }

  //     return entities.map((entity) =>
  //       sanitizeEntity(entity, { model: strapi.models.order })
  //     );
  //   },

  // Post request to strapi/orders - PAY ATTENTION TO S on the end!!!
  async create(ctx) {
    /*
     * Products should bring in, size, quanity, price, and id, name
     */
    const { products } = ctx.request.body;
    const { user } = ctx.state;
    const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

    // Map through all products from cart then make them a line item and put into array
    const lineItems = products.map((product) => {
      let item = {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${product.name} (${product.size})`,
          },
          unit_amount: fromDecimalToInt(product.price),
        },
        quantity: product.quantity,
      };
      return item;
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: user.email,
      mode: "payment",
      success_url: `${BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: BASE_URL,
      line_items: lineItems,
    });

    // Create Order In strapi
    const newOrder = await strapi.service("api::order.order").create({
      data: {
        user: user.id,
        product: 3,
        total: (session.amount_total / 100).toFixed(2),
        status: "unpaid",
        checkout_session: session.id,
      },
    });

    return { id: session.id };
  },

  async confirm(ctx) {
    // Retrieve session id from body
    const { checkout_session } = ctx.request.body;

    // Retrieve sesssion from stripe
    const session = await stripe.checkout.sessions.retrieve(checkout_session);

    // Returns array of objects with the right order filtered by checkout_session
    let order = await strapi
      .service("api::order.order")
      .findOneBySession(checkout_session);

    // If paid then update status, else throw 400 error with message
    if (session.payment_status === "paid") {
      const updateOrder = await strapi.entityService.update(
        "api::order.order",
        order[0].id,
        {
          data: { status: "paid" },
        }
      );
      order = await strapi
        .service("api::order.order")
        .findOneBySession(checkout_session);

      return order[0];
    } else {
      ctx.throw(400, "Payment not successful, please contact support");
    }
  },
}));
