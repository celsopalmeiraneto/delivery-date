import express, { json } from 'express';
import Joi from '@hapi/joi';
import { createPurchaseOrder } from './domain/purchaseOrder';
import { InputError } from './InputError';

const app = express();
app.use(json());

const purchaseOrderSchema = Joi.object({
  region: Joi.string().required(),
  basket: Joi.object({
    items: Joi.array()
      .items(
        Joi.object({
          produsct: Joi.string().required(),
          ciount: Joi.number().integer().min(1).required(),
        })
      )
      .min(1),
  }).required(),
}).required();

app.post('/purchase-order', async (req, res) => {
  const validationResult = purchaseOrderSchema.validate(req.body);

  if (validationResult.error) {
    return res.status(400).json(validationResult.error);
  }

  const body = validationResult.value;

  try {
    const response = await createPurchaseOrder(
      body.region,
      body.basket.items.map((item: any) => ({
        productId: item.produsct,
        amount: item.ciount,
      }))
    );

    return res.json(response);
  } catch (e) {
    if (e instanceof InputError) return res.status(400).send(e.message);

    return res.status(500).send(e.message);
  }
});

const port = process.env.PORT || 8000;
app.listen(port);

console.log(`The API is listening to connections on the port ${port}.`);
