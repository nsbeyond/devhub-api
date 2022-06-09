import _ from 'lodash'
// import { Op } from 'sequelize/types'
import MarketPost from '../../models/market.post.model'
import MarketPicture from '../../models/market.picture.model'
import MarketLike from '../../models/market.like.model'
import MarketComment from '../../models/market.comment.model'

export const getAllItem = async (request, reply) => {
  try {
    MarketComment.hasMany(MarketLike, {
      foreignKey: 'comment_id'
    })
    MarketPost.hasOne(MarketPicture, {
      foreignKey: 'market_place_id'
    })
    MarketPost.hasMany(MarketLike, {
      foreignKey: 'market_place_id'
    })
    MarketPost.hasMany(MarketComment, {
      foreignKey: 'market_place_id'
    })
    const item = await MarketPost.findAll({
      limit: 300,
      include: [MarketPicture, MarketLike, MarketComment]
    })

    if (_.isNull(item)) {
      reply.send('Not found')
    } else {
      reply.send(item)
    }

  } catch (error) {
    reply.send(error)
  }
  return reply
}

export const getViewItem = async (request, reply) => {
  try {
    const { postID } = request.query
    MarketComment.hasMany(MarketLike, {
      foreignKey: 'comment_id'
    })
    MarketPost.hasOne(MarketPicture, {
      foreignKey: 'market_place_id'
    })
    MarketPost.hasMany(MarketLike, {
      foreignKey: 'market_place_id'
    })
    MarketPost.hasMany(MarketComment, {
      foreignKey: 'market_place_id'
    })
    
    const item = await MarketPost.findOne(
    { 
      where: { id: postID },
      include: [MarketPicture, MarketLike, MarketComment]
    })

    if (_.isNull(item)) {
      reply.send('Post Not found')
    } else {
      reply.send(item)
    }

  } catch (error) {
    reply.send('error')
  }
  return reply
}

export const getCommentLike = async (request, reply) => {
  try {
    const { commentID } = request.query
    
    const item = await MarketLike.findAll(
    { 
      where: { comment_id: commentID },
    })

    if (_.isNull(item)) {
      reply.send('Comment Not found')
    } else {
      reply.send(item)
    }

  } catch (error) {
    reply.send('error')
  }
  return reply
}
