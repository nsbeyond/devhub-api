import {
  getAllItem,
  getViewItem,
  getCommentLike,
} from '../controllers/market/market.controller'

const routes = (fastify, options, done) => {
  fastify.get('/market/getAllItem', getAllItem)
  fastify.get('/market/viewItem', getViewItem)
  fastify.get('/market/getCommentLike', getCommentLike)
  done()
}

export default routes
