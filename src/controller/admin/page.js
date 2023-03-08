const Page = require("../../models/page");

exports.createPage = async (req, res) => {
  const { banners, products } = req.files;
  if (banners && banners.length > 0) {
    req.body.banners = banners.map((banner, index) => ({
      img: `/public/${banner.filename}`,
      navigateTo: `/bannerClicked?categoryId=${req.body.category}&type=${req.body.type}`,
    }));
  }

  if (products && products.length > 0) {
    req.body.products = products.map((product, index) => ({
      img: `/public/${product.filename}`,
      navigateTo: `/productZClicked?categoryId=${req.body.category}&type=${req.body.type}`,
    }));
  }

  req.body.createdBy = req.user._id;

  await Page.findOne({ category: req.body.category }).exec(async (error, page) => {
    if (error) return res.status(400).json({ error });
    if (page) {
      Page.findOneAndUpdate({ category: req.body.category }, req.body).exec(
        (error, updatedPage) => {
          if (error) return res.status(400).json({ error });
          if (updatedPage) {
            return res.status(201).json({ page: updatedPage });
          }
        }
      );
    } else {
      const page = new Page(req.body);

      await page.save((error, page) => {
        if (error) return res.status(400).json({ error });
        if (page) {
          return res.status(201).json({ page });
        }
      });
    }
  });
};

exports.getPage = async (req, res) => {
  const { category, type } = req.params;
  if (type === "page") {
    await Page.findOne({ category: category }).exec((error, page) => {
      if (error) return res.status(400).json({ error });
      if (page) return res.status(200).json({ page });
    });
  }
};

exports.deletePage = async (req, res) => {
  const { id } = req.params;
  await Page.deleteOne({ _id: id })
    .then((res) => {
      res.status(200).json(res);
    })
    .catch((error) => {
      return res.status(400).json(error);
    });
};
