export default mongoose => {
  const schema = mongoose.Schema(
    {
      username: String,
      password: String,
      email: String,
      birth_date: String,
      profile_image: String,
    },
    { timestamps: true }
  )
  
  schema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject()
    object.id = _id
    return object
  })

  const UserModel = mongoose.model('users', schema)

  return UserModel
}