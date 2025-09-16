const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const User = require("./user");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose
  .connect(
    "mongodb+srv://enterpriseshilton76_db_user:Hiltonenterprises76@barcode-db.dqgvpiy.mongodb.net/barcode-db?retryWrites=true&w=majority&appName=barcode-db",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("✅ MongoDB connected");
    createDefaultAdmin();
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

async function createDefaultAdmin() {
  try {
    const adminExists = await User.findOne({ role: "admin" });
    if (!adminExists) {
      const defaultAdmin = new User({
        username: "admin",
        password: "admin123",
        role: "admin",
      });
      await defaultAdmin.save();
      console.log("✅ Default admin created: username=admin, password=admin123");
    }
  } catch (err) {
    console.error("❌ Error creating default admin:", err);
  }
}

// Login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({ success: false, message: "❌ User not found" });

    if (user.password !== password)
      return res.status(400).json({ success: false, message: "❌ Invalid password" });

    res.json({
      success: true,
      role: user.role,
      category: user.category || null,
      message: "✅ Login successful",
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Create User (Admin can create new users)
app.post("/api/users", async (req, res) => {
  try {
    const { username, password, category } = req.body;

    if (!username || !password || !category) {
      return res.status(400).json({ success: false, message: "❌ All fields required" });
    }

    let role;
    if (category === "Export Office") role = "export";
    else if (["Apparel", "Bedding", "Socks", "Safety and PPE"].includes(category)) role = "user";

    else if (category === "admin") role = "admin";
    else return res.status(400).json({ success: false, message: "❌ Invalid category" });

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ success: false, message: "❌ Username already exists" });

    const newUser = new User({ username, password, role, category });
    await newUser.save();

    res.json({ success: true, message: "✅ User created successfully", newUser });
  } catch (err) {
    console.error("❌ Error creating user:", err);
    res.status(500).json({ success: false, message: "Error creating user" });
  }
});

// Get all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ["user", "export"] } });
    res.json(users);
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({ success: false, message: "Error fetching users" });
  }
});

// Delete User
app.delete("/api/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "✅ User deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting user:", err);
    res.status(500).json({ success: false, message: "Error deleting user" });
  }
});

// PRODUCT MANAGEMENT – PDF Handling Updated
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // ✅ Unique name: timestamp + original filename
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage: storage });

const productSchema = new mongoose.Schema({
  barcode: { type: String, required: true },
  itemName: { type: String, required: true },
  carton: { type: String, required: true },
  color: { type: String, required: true },
  size: { type: String, required: true },
  pcs: { type: String, required: true },
  department: { type: String, required: true },
  pdfFile: { type: String },
  pdfOriginalName: { type: String }, // ✅ store original filename
});
const Product = mongoose.model("Product", productSchema);

// Add Product
app.post("/api/add-product", upload.single("pdfFile"), async (req, res) => {
  try {
    const productData = { ...req.body };
    if (req.file) {
      productData.pdfFile = req.file.filename;       // saved file name
      productData.pdfOriginalName = req.file.originalname; // original name
    }
    const product = new Product(productData);
    await product.save();
    res.json({ success: true, message: "✅ Product added", product });
  } catch (err) {
    console.error("❌ Error adding product:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get Products
app.get("/api/products", async (req, res) => {
  try {
    const { search, size, role, department } = req.query;
    let filter = {};
   if ((role === "user" || role === "export") && department) {
  filter.department = { $regex: `^${department}$`, $options: "i" };
}

    if (search) {
      const regex = new RegExp(search.trim(), "i");
      filter.$and = filter.$and || [];
      filter.$and.push({ $or: [{ barcode: regex }, { itemName: regex }, { carton: regex }, { color: regex }, { size: regex }] });
    }
    if (size) {
      filter.$and = filter.$and || [];
      filter.$and.push({ size: new RegExp(`^${size}$`, "i") });
    }
    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete Product → Admin only
app.delete("/api/product/:id", async (req, res) => {
  try {
    const { role } = req.query;

    // Sirf admin delete kar sakta hai
    if (role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "❌ Only admin can delete products" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "❌ Product not found" });
    }

    // Agar PDF file exist karti hai to delete kar do
    if (product.pdfFile) {
      const filePath = path.join(__dirname, "uploads", product.pdfFile);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "✅ Product deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting product:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Server error while deleting product." });
  }
});

// Start server
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
