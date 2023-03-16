const Product = require("../models/product");
const Category = require("../models/category");
const shortid = require("shortid");
const slugify = require("slugify");

exports.createProduct = async (req, res) => {
  const { name, price, description, category, quantity, createdBy } = req.body;
  let productPictures = [];

  if (req.files && req.files.length > 0) {
    productPictures = req.files.map((file) => {
      return { img: `/public/${file.filename}` };
    });
  }

  const product = new Product({
    name: name,
    slug: slugify(name),
    price,
    quantity,
    description,
    productPictures,
    category,
    createdBy: req.user._id,
  });

  await product.save((error, product) => {
    if (error) return res.status(400).json({ error });
    if (product) {
      res.status(201).json({ product, files: req.files });
    }
  });
};

exports.getProductsBySlug = async (req, res) => {
  const { slug } = req.params;
  await Category.findOne({ slug: slug })
    .select("_id type")
    .exec(async (error, category) => {
      if (error) {
        return res.status(400).json({ error });
      }

      if (category) {
        await Product.find({ category: category._id }).exec((error, products) => {
          if (error) {
            return res.status(400).json({ error });
          }

          if (category.type) {
            if (products.length > 0) {
              res.status(200).json({
                products,
                priceRange: {
                  under5k: 5000,
                  under10k: 10000,
                  under15k: 15000,
                  under20k: 20000,
                  under30k: 30000,
                },
                productsByPrice: {
                  under5k: products.filter((product) => product.price <= 5000),
                  under10k: products.filter(
                    (product) => product.price > 5000 && product.price <= 10000
                  ),
                  under15k: products.filter(
                    (product) => product.price > 10000 && product.price <= 15000
                  ),
                  under20k: products.filter(
                    (product) => product.price > 15000 && product.price <= 20000
                  ),
                  under30k: products.filter(
                    (product) => product.price > 20000 && product.price <= 30000
                  ),
                },
              });
            }
          } else {
            res.status(200).json({ products });
          }
        });
      }
    });
};

exports.getProductDetailsById = async (req, res) => {
  const { productId } = req.params;
  if (productId) {
    await Product.findOne({ _id: productId }).exec((error, product) => {
      if (error) return res.status(400).json({ error });
      if (product) {
        res.status(200).json({ product });
      }
    });
  } else {
    return res.status(400).json({ error: "Params required" });
  }
};

// new update
exports.deleteProductById = async (req, res) => {
  const { productId } = req.body.payload;
  if (productId) {
    await Product.deleteOne({ _id: productId }).exec((error, result) => {
      if (error) return res.status(400).json({ error });
      if (result) {
        res.status(202).json({ result });
      }
    });
  } else {
    res.status(400).json({ error: "Params required" });
  }
};

exports.getProducts = async (req, res) => {
  const products = await Product.find()
    .select("name price quantity slug description productPictures category")
    .populate({ path: "category", select: "name" })
    .exec();
  res.status(200).json({ products });
};

exports.searchProduct = async (req, res) => {
  const search = req.query.search;
  const products = await Product.find({
    slug: {
      $regex: `(?=S*['-])([a-zA-Z'-]+)${search}`,
      $options: "ix",
    },
  });
  res.status(200).json({ products });
};
