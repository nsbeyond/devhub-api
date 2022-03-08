import db from '../../models'
import bcrypt from 'bcrypt'
import fs from 'fs'

const User = db.user

export const getInfo = async (request, reply) => {
  const { uuid } = request.query
  await User.findOne({ _id: uuid }).then((user) => {
    reply.send(user)
  })
}

export const register = async (request, reply) => {
  const { username, password, email, birth_date, profile_image } = request.body
  await User.findOne({ $or: [{ email: email }, { username: username }] })
  .then(async(user) => {
    if (user) {
      reply.send({ success: false, message: 'Email or Username already exists!' })
    } else {
      const path = fs.writeFileSync(profile_image.filename, profile_image.toBuffer());
      let hashPassword = ''
      bcrypt.hash(password.value, 9, async function (err, hash) {
        hashPassword = hash
      });
      const newUser =  new User({
        username: username.value,
        password: hashPassword,
        email: email.value,
        birth_date: '10/11/1990',
        profile_image: '',
      })
      newUser.save()
      const message = {
        success: true,
        data: { user: newUser },
      }
      reply.send(message)
    }
  })
}

export const login = async (request, reply) => {
  const { username, password } = request.body
  await User.findOne({ username: username })
    .then((user) => {
      if (user) {
        bcrypt.compare(password, user.password, async function (err, result) {
          if (result) {
            const token = await reply.jwtSign({ user })
            reply.send(token)
          }
          else {
            reply.send({ success: false, message: 'Please enter validate password' })
          }
        });
      } else {
        reply.send({ success: false, message: 'User not found!' })
      }
    })
}

// export const getInfo = async (request, reply) => {
//   request.jwtVerify(function (err, decoded) {
//     return reply.send(err || decoded)
//   })
// }