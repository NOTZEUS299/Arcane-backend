const Fav = require("../models/fav");

exports.createFav = async (req, res) => {
  const { product, yourChoice } = req.body;
  const { _id } = req.user;

  try {
    const data = new Fav({
      product,
      user: _id,
      yourChoice,
    });

    await data
      .save()
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((error) => {
        return res.status(400).send(error);
      });
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.updateFav = async (req, res) => {
  const { id } = req.params;
  try {
    await Fav.findOneAndUpdate({ _id: id }, req.body, { new: true })
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((error) => {
        return res.status(400).send(error);
      });
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.deleteFav = async (req, res) => {
  const { id } = req.params;
  try {
    await Fav.deleteOne({ _id: id })
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((error) => {
        return res.status(400).send(error);
      });
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.findAllFav = async (req, res) => {
  try {
    await Fav.find()
      .populate([
        {
          path: "product",
          model: "Product",
        },
        {
          path: "user",
          model: "User",
        },
      ])
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((error) => {
        return res.status(400).send(error);
      });
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.findByUser = async (req, res) => {
  const { _id } = req.user;
  try {
    await Fav.find({ user: _id })
      .populate([
        {
          path: "product",
          model: "Product",
        },
        {
          path: "user",
          model: "User",
        },
      ])
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((error) => {
        return res.status(400).send(error);
      });
  } catch (error) {
    return res.status(400).send(error);
  }
};
