import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import _ from 'lodash'
import db from '../../models'

const config = process.env
const jwtExpire = _.get(config, 'JWT_EXPIRE', '1h')
const User = db.user

export const getInfo = async (request, reply) => {
  const { uuid } = request.query
  try {
    await User.findOne({ _id: uuid }).then((data) => {
      reply.send(data)
    })
  } catch (error) {
    reply.send(error)
  }
  return reply
}

export const register = async (request, reply) => {
  let uploadPath

  const { username, password, email, birthDate, profileImage } = request.body

  try {
    await User.findOne({
      $or: [{ email: email.value }, { username: username.value }],
    }).then(async (user) => {
      if (user) {
        reply.send({
          success: false,
          message: 'Email or Username already exists!',
        })
      } else {
        if (!_.isEmpty(profileImage.filename)) {
          const fileExt = _.last(_.split(profileImage.filename, '.'))
          uploadPath = `uploads/profile_images/${uuidv4()}.${fileExt}`
          fs.writeFileSync(uploadPath, await profileImage.toBuffer())
        }
        bcrypt.hash(password.value, 9, async (err, hash) => {
          const newUser = await new User({
            username: username.value,
            password: hash,
            email: email.value,
            birth_date: birthDate.value,
            profile_image: _.isEmpty(uploadPath) ? '' : uploadPath,
          })

          await newUser.save()
          const token = await reply.jwtSign(
            { newUser },
            { expiresIn: jwtExpire },
          )
          const message = {
            success: true,
            data: { token },
          }
          reply.send(message)
        })
      }
    })
  } catch (error) {
    reply.send(error)
  }
  return reply
}

export const login = async (request, reply) => {
  const { username, password } = request.body
  try {
    await User.findOne({ username: username.value }).then((user) => {
      if (user) {
        bcrypt.compare(password.value, user.password, async (err, result) => {
          if (result) {
            const token = await reply.jwtSign(
              { user },
              { expiresIn: jwtExpire },
            )
            reply.send({
              success: true,
              data: user,
              token: token,
            })
          } else {
            return reply.send({
              success: false,
              message: 'Please enter validate password',
            })
          }
        })
      } else {
        reply.send({ success: false, message: 'User not found!' })
      }
    })
  } catch (error) {
    reply.send(error)
  }
  return reply
}

export const validateToken = async (request, reply) => {
  try {
    request.jwtVerify((err, decoded) => {
      if (err) {
        reply.send(err)
      }
      reply.send(decoded)
    })
  } catch (error) {
    reply.send(error)
  }
  return reply
}

export const multiUpload = async (request, reply) => {
  let uploadPath
  const files = _.get(request.body, 'file[]')
  try {
    if (_.size(files) > 0 && !_.isArray(files)) {
      const fileExt = _.last(_.split(files.filename, '.'))
      uploadPath = `uploads/test/${uuidv4()}.${fileExt}`
      fs.writeFileSync(uploadPath, await files.toBuffer())
      reply.send('ok')
    } else if (_.size(files) > 0) {
      _.forEach(files, async (data) => {
        const fileExt = _.last(_.split(data.filename, '.'))
        uploadPath = `uploads/test/${uuidv4()}.${fileExt}`
        fs.writeFileSync(uploadPath, await data.toBuffer())
      })
      reply.send('ok')
    }
  } catch (error) {
    reply.send(error)
  }
  return reply
}
