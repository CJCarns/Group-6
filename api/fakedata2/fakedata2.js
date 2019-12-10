import { createConnection, getManager, getRepository} from 'typeorm';
import User from "../entities/user.js";
import Tag from "../entities/tag.js";
import Item from "../entities/item.js";
import Order_Item from "../entities/order_item.js";
import Order from "../entities/order.js";
import Announcement from "../entities/announcement.js";
import StaffAlert from "../entities/staff_alert.js";

//-----------EDIT HERE------------
var num_items = 10;
//--------------------------------
var counter = 0;

function randInt(leftVal, rightVal) {
  return Math.floor(Math.random() * (rightVal - leftVal) + leftVal)
}

function retCounter() {
  counter += 1;
  return counter;
}

createConnection().then(() => {
  var i = 0;
  var temp_set = new Set()
  // assign tags to items
  for(i = 0; i < num_items; i++) {
    //  query for a list of tag entities 
    var tags_list = [randInt(1, 10), randInt(1, 10)]
    while(tags_list[0] == tags_list[1]) {
      var tags_list = [randInt(1, 10), randInt(1, 10)]
    }
    let tag_entities = tags_list.map((tagID) => { 
      return getRepository(Tag).findOneOrFail(tagID).then((tag) => {
        return tag
      }, () => {
        console.log("--------tag not found------")  
      })
    });


    //  update item entity with a list of tags.
    Promise.all(tag_entities).then((tagEntities) => {
          var item_id = retCounter()
          getRepository(Item).findOneOrFail(item_id).then((item) => {
            console.log("--------item :", item_id, "---------------")
            item.tags = tagEntities;
            item_id += 1
            getManager().save(item).then((savedItem) => {
              console.log("-----------tag[s] successfully saved")
              console.log(tagEntities)
            }, () => {
              console.log("--------tag not found------")  
            })
          }, () =>
          {
            console.log("--------tag not found------")  
          })
      })
  }

  console.log("hello")
})

