import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dns from "node:dns";
import multer from "multer";

import cloudinary from "./config/cloudinary.js";
import Project from "./models/Project.js";
import Admin from "./models/Admin.js";
import nodemailer from "nodemailer";
import rateLimit from "express-rate-limit";

dotenv.config();

dns.setServers([
  "1.1.1.1",
  "1.0.0.1",
]);

const app = express();

const PORT = process.env.PORT || 5000;

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 5,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    message:
      "Too many messages have been sent. Please try again later.",
  },
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure:
    process.env.SMTP_SECURE === "true",

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


// ------------------------------------
// MIDDLEWARE
// ------------------------------------

const allowedOrigins = [
  "http://localhost:5173",
  "https://ismail-portfolio-7y5z.onrender.com",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());


// ------------------------------------
// MULTER IMAGE UPLOAD
// ------------------------------------

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 8 * 1024 * 1024,
    files: 8,
  },

  fileFilter: (req, file, callback) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return callback(
        new Error(
          "Only JPG, PNG, WEBP and AVIF images are allowed"
        )
      );
    }

    callback(null, true);
  },
});


// ------------------------------------
// CLOUDINARY UPLOAD HELPER
// ------------------------------------

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream =
      cloudinary.uploader.upload_stream(
        {
          folder: "portfolio/projects",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(result);
        }
      );

    uploadStream.end(fileBuffer);
  });
};
const deleteCloudinaryImages = async (images = []) => {
  const validImages = images.filter(
    (image) => image?.publicId
  );

  await Promise.allSettled(
    validImages.map((image) =>
      cloudinary.uploader.destroy(image.publicId)
    )
  );
};


// ------------------------------------
// AUTH MIDDLEWARE
// ------------------------------------

const requireAuth = (req, res, next) => {
  const token = req.cookies.adminToken;

  if (!token) {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.adminId = decoded.adminId;

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired session",
    });
  }
};


// ------------------------------------
// AUTH ROUTES
// ------------------------------------

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const admin = await Admin.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordIsValid =
      await bcrypt.compare(
        password,
        admin.password
      );

    if (!passwordIsValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        adminId: admin._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    res.cookie("adminToken", token, {
      httpOnly: true,
      secure:
        process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
    });
  } catch (error) {
    console.error(
      "Login error:",
      error.message
    );

    res.status(500).json({
      message: "Login failed",
    });
  }
});


app.get(
  "/api/auth/me",
  requireAuth,
  (req, res) => {
    res.status(200).json({
      authenticated: true,
    });
  }
);


app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("adminToken", {
    httpOnly: true,
    secure:
      process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.status(200).json({
    message: "Logged out successfully",
  });
});


// ------------------------------------
// PROJECT IMAGE UPLOAD
// PROTECTED
// ------------------------------------

app.post(
  "/api/uploads/projects",
  requireAuth,
  upload.array("images", 8),
  async (req, res) => {
    const uploadedImages = [];

    try {
      if (
        !req.files ||
        req.files.length === 0
      ) {
        return res.status(400).json({
          message: "No images were selected",
        });
      }

      for (const file of req.files) {
        const result =
          await uploadToCloudinary(
            file.buffer
          );

        uploadedImages.push({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }

      res.status(201).json({
        message:
          "Images uploaded successfully",
        images: uploadedImages,
      });
    } catch (error) {
      console.error(
        "Image upload error:",
        error.message
      );
      for (const image of uploadedImages) {
        try {
          await cloudinary.uploader.destroy(
            image.publicId
          );
        } catch (cleanupError) {
          console.error(
            "Cloudinary cleanup error:",
            cleanupError.message
          );
        }
      }

      res.status(500).json({
        message:
          "Failed to upload images",
      });
    }
  }
);


// ------------------------------------
// HEALTH
// ------------------------------------

app.get("/api/health", (req, res) => {
  res.status(200).json({
    message: "Portfolio API is running",
  });
});


// ------------------------------------
// GET ALL PROJECTS
// PUBLIC
// ------------------------------------

app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find();

    res.status(200).json(projects);
  } catch (error) {
    console.error(
      "Error fetching projects:",
      error.message
    );

    res.status(500).json({
      message:
        "Failed to fetch projects",
    });
  }
});


// ------------------------------------
// GET ONE PROJECT BY SLUG
// PUBLIC
// ------------------------------------

app.get(
  "/api/projects/:slug",
  async (req, res) => {
    try {
      const project =
        await Project.findOne({
          slug: req.params.slug,
        });

      if (!project) {
        return res.status(404).json({
          message: "Project not found",
        });
      }

      res.status(200).json(project);
    } catch (error) {
      console.error(
        "Error fetching project:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to fetch project",
      });
    }
  }
);


// ------------------------------------
// CREATE PROJECT
// PROTECTED
// ------------------------------------

app.post(
  "/api/projects",
  requireAuth,
  async (req, res) => {
    try {
      const existingProjects =
        await Project.find(
          {},
          "number"
        );

      const highestNumber =
        existingProjects.reduce(
          (highest, project) => {
            const projectNumber =
              parseInt(
                project.number,
                10
              );

            if (
              Number.isNaN(
                projectNumber
              )
            ) {
              return highest;
            }

            return Math.max(
              highest,
              projectNumber
            );
          },
          0
        );

      const nextNumber = String(
        highestNumber + 1
      ).padStart(2, "0");

      const project =
        await Project.create({
          ...req.body,
          number: nextNumber,
        });

      res.status(201).json({
        message:
          "Project created successfully",
        project,
      });
    } catch (error) {
      console.error(
        "Error creating project:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to create project",
      });
    }
  }
);


// ------------------------------------
// UPDATE PROJECT
// PROTECTED
// ------------------------------------

app.put(
  "/api/projects/:id",
  requireAuth,
  async (req, res) => {
    try {
      const existingProject =
        await Project.findById(req.params.id);

      if (!existingProject) {
        return res.status(404).json({
          message: "Project not found",
        });
      }

      const nextImages = Array.isArray(
        req.body.images
      )
        ? req.body.images
        : existingProject.images;

      const nextPublicIds = new Set(
        nextImages.map(
          (image) => image.publicId
        )
      );

      const removedImages =
        existingProject.images.filter(
          (image) =>
            !nextPublicIds.has(
              image.publicId
            )
        );

      existingProject.set({
        ...req.body,
        images: nextImages,
      });

      await existingProject.save();

      await deleteCloudinaryImages(
        removedImages
      );

      res.status(200).json({
        message:
          "Project updated successfully",
        project: existingProject,
      });
    } catch (error) {
      console.error(
        "Error updating project:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to update project",
      });
    }
  }
);


// ------------------------------------
// DELETE PROJECT
// PROTECTED
// ------------------------------------

app.delete(
  "/api/projects/:id",
  requireAuth,
  async (req, res) => {
    try {
      const project =
        await Project.findByIdAndDelete(
          req.params.id
        );

      if (!project) {
        return res.status(404).json({
          message: "Project not found",
        });
      }

      await deleteCloudinaryImages(
        project.images
      );

      res.status(200).json({
        message:
          "Project deleted successfully",
      });
    } catch (error) {
      console.error(
        "Error deleting project:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to delete project",
      });
    }
  }
);

// ------------------------------------
// CONTACT
// PUBLIC
// ------------------------------------

app.post(
  "/api/contact",
  contactLimiter,
  async (req, res) => {
    try {
      const {
        name,
        email,
        subject,
        message,
        website,
      } = req.body;

      // --------------------------------
      // HONEYPOT ANTI-SPAM
      // --------------------------------

      if (website?.trim()) {
        // Pretend that the message was sent
        // so the bot does not know it was blocked.
        return res.status(200).json({
          message:
            "Message sent successfully.",
        });
      }

      // --------------------------------
      // REQUIRED FIELDS
      // --------------------------------

      if (
        !name?.trim() ||
        !email?.trim() ||
        !subject?.trim() ||
        !message?.trim()
      ) {
        return res.status(400).json({
          message:
            "Please complete all fields.",
        });
      }

      // --------------------------------
      // LENGTH VALIDATION
      // --------------------------------

      if (
        name.length > 80 ||
        email.length > 150 ||
        subject.length > 120 ||
        message.length > 2000
      ) {
        return res.status(400).json({
          message:
            "One or more fields are too long.",
        });
      }

      // --------------------------------
      // EMAIL VALIDATION
      // --------------------------------

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailRegex.test(email.trim())
      ) {
        return res.status(400).json({
          message:
            "Please enter a valid email address.",
        });
      }

      // --------------------------------
      // CLEAN VALUES
      // --------------------------------

      const safeName = name
        .trim()
        .replace(/[\r\n]/g, " ");

      const safeSubject = subject
        .trim()
        .replace(/[\r\n]/g, " ");

      const safeEmail =
        email.trim();

      const safeMessage =
        message.trim();

      // --------------------------------
      // SEND EMAIL
      // --------------------------------

      await transporter.sendMail({
        from:
          `"Portfolio Contact" <${process.env.SMTP_USER}>`,

        to:
          process.env.CONTACT_TO_EMAIL,

        replyTo: safeEmail,

        subject:
          `Portfolio Contact: ${safeSubject}`,

        text: `
New message from your portfolio

Name:
${safeName}

Email:
${safeEmail}

Subject:
${safeSubject}

Message:
${safeMessage}
        `.trim(),
      });

      return res.status(200).json({
        message:
          "Message sent successfully.",
      });
    } catch (error) {
      console.error(
        "Contact email error:",
        error.message
      );

      return res.status(500).json({
        message:
          "Message could not be sent. Please try again.",
      });
    }
  }
);

// ------------------------------------
// MULTER ERROR HANDLER
// ------------------------------------

app.use((error, req, res, next) => {
  if (
    error instanceof
    multer.MulterError
  ) {
    return res.status(400).json({
      message: error.message,
    });
  }

  if (
    error.message ===
    "Only JPG, PNG, WEBP and AVIF images are allowed"
  ) {
    return res.status(400).json({
      message: error.message,
    });
  }

  next(error);
});


// ------------------------------------
// GENERAL ERROR HANDLER
// ------------------------------------

app.use((error, req, res, next) => {
  console.error(
    "Unhandled server error:",
    error.message
  );

  res.status(500).json({
    message:
      "Internal server error",
  });
});


// ------------------------------------
// DATABASE + SERVER
// ------------------------------------

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error(
      "MongoDB connection error:",
      error.message
    );
  });