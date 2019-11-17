import { Router } from 'express';
import { getRepository, getManager } from 'typeorm';
import isAuthenticated from '../middleware/isAuthenticated';
// import checkPermission from '../middleware/checkPermission';
import Announcement from '../entities/announcement';



const router = Router();
router.route('/announcement')
  // .all(isAuthenticated)
//   .get((req, res) => {
//     const allItem = getRepository(Item)
//     .createQueryBuilder("items")
//     .getMany();
//     debugger
//     res.send(allItem)

//   })
  .post((req, res) => {
    const { title, description, link, color } = req.body;
    const manager = getManager();
    const announce = manager.create(Announcement, { title, description, link, color });

    manager.save(announce).then((savedannounce) => {
      res.send(savedannounce);
    });
  });




router.route('/announcement/:id')
  .all(isAuthenticated)
  .all((req, res, next) => {
    getRepository(Announcement).findOneOrFail(
      { where: { id: req.params.id } },
    ).then((_foundAnnouncement) => {
      req.announcement = _foundAnnouncement;
      next();
    }, () => {
      res.send(404);
    });
  })




  .put((req, res) => {
    const foundAnnounce = req.announcement;
    const {title, description, link, color } = req.body;


    foundannounce.title = title;
    foundannounce.description = description;
    foundannounce.link = link;
    foundannounce.color = color;


    getManager().save(foundAnnounce).then((updatedAnnounce) => {
      res.send(updatedAnnounce);
    });
  })

  .get((req, res) => {
    res.send(req.announcement);
  })

  .delete((req, res) => {
    getManager().delete(Announcement, req.announcement.id).then(() => {
      res.send(200);
    });
  });

export default router;
