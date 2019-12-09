import { Router } from 'express';
import { getRepository, getManager } from 'typeorm';
import isAuthenticated from '../middleware/isAuthenticated';
// import checkPermission from '../middleware/checkPermission';
import Item from '../entities/item';
import Order_ from '../entities/order';
import Order_Item from '../entities/order_item';

const router = Router();
router.route('/cart')
  .all(isAuthenticated)

  .post((req, res) => {

    const manager = getManager();
    let totalCost = 0;
    let totalWeight = 0;

    const { address, order_items } = req.body;
    let itemPromises = order_items.map((item) => {
        let order_item = manager.create(Order_Item);
        return getRepository(Item).findOneOrFail(item.spice.id).then((spice) => {
            debugger;
            let item_weight = item.amount;
            let item_cost = spice.unit_price * item.amount * ((100.0 - spice.sale) / 100.0);
            order_item.cost = item_cost;
            order_item.weight = item_weight;
            order_item.item = spice; 
            spice.stock = spice.stock - item_weight;
            if(spice.stock < 0){
                res.send(400); 
            }
            return getManager().save(spice).then(()=> {
                return order_item; 
            })
        })
    })



    return Promise.all(itemPromises).then((orderItems) => {
        let myOrder = manager.create(Order_);
        myOrder.total_cost = totalCost;
        myOrder.total_weight = totalWeight;
        myOrder.address = address;
        myOrder.order_items = orderItems;
        myOrder.user = req.user;
        myOrder.staff_id = -1;
        myOrder.order_status = 2;
        myOrder.tracking_num = '';
        return getManager().save(myOrder).then((savedOrder) => {
            res.send(savedOrder);
        }, ()=> {
            res.send(400);
        })

    })
});

  export default router;


