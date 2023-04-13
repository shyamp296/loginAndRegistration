exports.get404 = async (req, res, next) => {
    await res.status(404).json({'message':'404'})
}
